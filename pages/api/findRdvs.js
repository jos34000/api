import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const token = req.body.token
    const date = new Date(req.body.date)

    let doctorId = await prisma.doctor.findUnique({
      where: {
        token: token,
      },
      select: {
        doctorId: true,
      },
    })

    try {
      const today = new Date(date)
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const rdv = await prisma.rdv.findMany({
        where: {
          doctorId: doctorId.doctorId,
          dispo: {
            date: {
              gte: today,
              lt: tomorrow,
            },
          },
        },
        select: {
          rdvId: true,
          patient: {
            select: {
              firstname: true,
              lastname: true,
              Patienthistory: {
                select: {
                  history: {
                    select: {
                      antecedent: true,
                    },
                  },
                },
              },
            },
          },
          dispo: true,
          motif: true,
        },
        orderBy: {
          rdvId: "asc",
        },
      })
      res.status(200).send(rdv)
    } catch (error) {
      logError("read", "findRdvs.js", "searchRdv", error)
      res.status(500).json({ error: "Une erreur est survenue" })
    }
  } else {
    logError(
      "read",
      "findRdvs.js",
      "searchRdv",
      "Méthode non authorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
