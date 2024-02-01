import { PrismaClient } from "@prisma/client"
import { parse, startOfDay, endOfDay } from "date-fns"
const prisma = new PrismaClient()

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (req.method === "GET") {
    const { doctor, date } = req.query
    let doctorId = Number(doctor)
    if (!date) {
      res.status(400).json({ message: "La date est requise" })
      return
    }

    // Convertir la date du formulaire en objet Date
    const dateFromForm = parse(date, "yyyy-MM-dd", new Date())

    // Créer les dates de début et de fin de la journée pour la comparaison
    const startOfDate = startOfDay(dateFromForm)
    const endOfDate = endOfDay(dateFromForm)

    try {
      const dispos = await prisma.dispo.findMany({
        where: {
          doctorId: doctorId,
          // Comparer la date de la base de données avec la plage de dates
          date: {
            gte: startOfDate,
            lte: endOfDate,
          },
        },
        select: {
          timeslot: true,
        },
      })

      res.json(dispos)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Internal Server Error" })
    }
  }
}
