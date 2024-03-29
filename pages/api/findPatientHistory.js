import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import NextCors from "nextjs-cors"
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  await NextCors(req, res, {
    origin: "*",
    methods: ["POST"],
  })
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
      const patienthistory = await prisma.patienthistory.findMany({
        where: {
          patientId: patientId.patientId,
        },
        include: {
          history: true,
        },
        orderBy: {
          historyId: "asc",
        },
      })
      res.status(200).send(patienthistory)
    } catch (error) {
      logError("read", "findPatientHistory.js", "searchPatientHistory", error)
      res.status(500).json({ error: "Une erreur est survenue" })
    }
  } else {
    logError(
      "read",
      "findPatientHistory.js",
      "searchPatientHistory",
      "Méthode non authorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
