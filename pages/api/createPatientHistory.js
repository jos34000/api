import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
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
  console.log(patient)

  const patientId = patient.patientId
  console.log(patientId)

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
        diagnosticDate: date,
        commentaires: comment,
      },
    })
    res.status(200).json({ history })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
