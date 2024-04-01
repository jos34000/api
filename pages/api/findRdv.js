import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const token = req.body.token

    let patientId = await prisma.patient.findUnique({
      where: {
        token: token,
      },
      select: {
        patientId: true,
      },
    })

    try {
      const rdv = await prisma.rdv.findMany({
        where: {
          patientID: patientId.patientId,
        },
        include: {
          doctor: true,
          dispo: true,
        },
        orderBy: {
          rdvId: "asc",
        },
      })
      res.status(200).send(rdv)
    } catch (error) {
      logError("read", "findRdv.js", "searchRdv", error)
      res.status(500).json({ error: "Une erreur est survenue" })
    }
  } else {
    logError(
      "read",
      "findRdv.js",
      "searchRdv",
      "Méthode non authorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
