import { PrismaClient } from "@prisma/client"
import { parse, startOfDay, endOfDay, isWeekend } from "date-fns"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (req.method === "POST") {
    let { token, date } = req.body
    if (!date) {
      logError("read", "findTimeslots.js", "isDate", "Pas de date entrée")
      res.status(400).json({ message: "La date est requise" })
      return
    }

    const dateFromForm = parse(date, "yyyy-MM-dd", new Date())

    const startOfDate = startOfDay(dateFromForm)
    const endOfDate = endOfDay(dateFromForm)

    try {
      let doctorId = await prisma.doctor.findUnique({
        where: {
          token: token,
        },
        select: {
          doctorId: true,
        },
      })
      doctorId = doctorId.doctorId

      let dispos = await prisma.dispo.findMany({
        where: {
          doctorId: doctorId,
          isReserved: false,
          timeslot: {
            gte: startOfDate,
            lte: endOfDate,
          },
        },
        select: {
          dispoId: true,
          timeslot: true,
        },
        orderBy: {
          timeslot: "asc",
        },
      })

      dispos = dispos.filter((dispo) => !isWeekend(new Date(dispo.date)))

      res.status(200).json(dispos)
    } catch (error) {
      logError("read", "findTimeslots.js", "searchDispos", error)
      return res.status(500).json({ error: "Une erreur est survenue" })
    }
  } else {
    logError(
      "read",
      "findTimeslots.js",
      "searchDispos",
      "Métohde non autorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
