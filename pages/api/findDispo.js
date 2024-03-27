import { PrismaClient } from "@prisma/client"
import { parse, startOfDay, endOfDay } from "date-fns"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (req.method === "GET") {
    const { doctor, date } = req.query
    let doctorId = Number(doctor)
    if (!date) {
      logError("read", "findDispo.js", "isDate", "Pas de date entrée")
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
          dispoId: true,
          timeslot: true,
        },
      })

      res.status(200).json(dispos)
    } catch (error) {
      logError("read", "findDispo.js", "searchDispos", error)
      return res.status(500).json({ error: "Une erreur est survenue" })
    }
  } else {
    logError(
      "read",
      "findDispo.js",
      "searchDispos",
      "Métohde non autorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
