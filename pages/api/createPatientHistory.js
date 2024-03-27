import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"
import NextCors from "nextjs-cors"

export default async function createPatientHistory(req, res) {
  await NextCors(req, res, {
    origin: "*",
    methods: ["POST"],
  })

  const { token, historyId, date, comment } = req.body
  const patient = await prisma.patient.findUnique({
    where: {
      token: token,
    },
    select: {
      patientId: true,
    },
  })

  const patientId = patient.patientId
  const isoDate = new Date(date).toISOString()
  if (req.method === "POST") {
    try {
      const history = await prisma.patienthistory.create({
        data: {
          patient: {
            connect: {
              patientId: patientId,
            },
          },
          history: {
            connect: {
              historyId: parseInt(historyId),
            },
          },
          diagnosticDate: isoDate,
          commentaires: comment,
        },
      })
      res.status(200).send(history)
    } catch (error) {
      logError(
        "create",
        "createPatientHistory.js",
        "createPatientHistory",
        error
      )
      return res.status(500).json({ error: "Une erreur est survenue" })
    }
  } else {
    logError(
      "create",
      "createPatientHistory.js",
      "createPatientHistory",
      "Méthode non autorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
