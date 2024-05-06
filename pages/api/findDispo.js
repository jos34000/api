import { PrismaClient } from "@prisma/client"
import { parse, startOfWeek, endOfWeek, isWeekend } from "date-fns"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (req.method === "POST") {
    let { doctorId, date } = req.body
    doctorId = Number(doctorId)
    if (!date) {
      logError("read", "findDispo.js", "isDate", "Pas de date entrée")
      res.status(400).json({ message: "La date est requise" })
      return
    }

    const dateFromForm = parse(date, "yyyy-MM-dd", new Date())

    const startOfDate = startOfWeek(dateFromForm, { weekStartsOn: 1 })
    const endOfDate = endOfWeek(dateFromForm, { weekStartsOn: 1 })

    try {
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
