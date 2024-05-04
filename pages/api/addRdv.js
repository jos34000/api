import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  if (req.method === "POST") {
    let { token, patientId, date, timeslot } = req.body
    patientId = parseInt(patientId)
    date = new Date(date).toISOString()
    try {
      const doctor = await prisma.doctor.findUnique({
        where: {
          token: token,
        },
        select: {
          doctorId: true,
        },
      })

      const doctorId = doctor.doctorId

      const patient = await prisma.patient.findUnique({
        where: {
          patientId: patientId,
        },
        select: {
          patientId: true,
        },
      })

      const patientIds = patient.patientId

      const dispo = await prisma.dispo.create({
        data: {
          date: date,
          timeslot: timeslot,
          doctorId: doctorId,
          isReserved: true,
        },
      })

      const dispoId = dispo.dispoId

      const rdv = await prisma.rdv.create({
        data: {
          patient: {
            connect: {
              patientId: patientIds,
            },
          },

          dispo: {
            connect: {
              dispoId: dispoId,
            },
          },
          doctor: {
            connect: {
              doctorId: doctorId,
            },
          },
        },
      })

      res.status(200).json({ rdv })
    } catch (error) {
      logError("create", "addRdv.js", "addARdvManually", error)
      res.status(500).json({ error: "Une erreur est survenue" })
    }
  } else {
    logError(
      "create",
      "addRdv.js",
      "addARdvManually",
      "Méthode non authorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
