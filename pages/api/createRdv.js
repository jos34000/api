import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import NextCors from "nextjs-cors"
import logError from "@/logs/logError.js"

export default async function createRdv(req, res) {
  await NextCors(req, res, {
    origin: "*",
    methods: ["POST"],
  })

  const { token, doctor, dispoId, motif } = req.body

  if (req.method === "POST") {
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
              dispoId: dispoId,
            },
          },
          motif: motif,
        },
      })

      // Mettre à jour le champ isReserved de la dispo associée à true
      await prisma.dispo.update({
        where: {
          dispoId: dispoId,
        },
        data: {
          isReserved: true,
        },
      })

      res.status(200).json(rdv)
    } catch (error) {
      logError("create", "createRdv.js", "createRDV", error)
      return res.status(500).json({ error: "Une erreur est survenue" })
    }
  } else {
    logError(
      "create",
      "addEntry.js",
      "createRDV",
      "Métohde non autorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
