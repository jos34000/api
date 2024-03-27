import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import NextCors from "nextjs-cors"
import logError from "@/logs/logError.js"

export default async function createRdv(req, res) {
  await NextCors(req, res, {
    origin: "*",
    methods: ["POST"],
  })

  const { token, doctorId, dispoId, motif } = req.body
  const doctor = Number(doctorId)
  const dispo = Number(dispoId)
  const patient = await prisma.patient.findUnique({
    where: {
      token: token,
    },
    select: {
      patientId: true,
    },
  })
  const patientId = patient.patientId

  try {
    const rdv = await prisma.rdv.create({
      data: {
        patient: {
          connect: {
            patientId: patientId,
          },
        },
        doctor: {
          connect: {
            doctorId: doctor,
          },
        },
        dispo: {
          connect: {
            dispoId: dispo,
          },
        },
        motif: motif,
      },
    })

    // Mettre à jour le champ isReserved de la dispo associée à true
    await prisma.dispo.update({
      where: {
        dispoId: dispo,
      },
      data: {
        isReserved: true,
      },
    })

    res.status(200).json(rdv)
  } catch (error) {
    logError("create", "createRdv.js", "createRDV", error)
    res.status(500).json({ error: "Une erreur est survenue" })
  }
}
