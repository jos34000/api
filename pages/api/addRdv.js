import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  if (req.method === "POST") {
    let { token, patientId, timeslot, motif } = req.body
    patientId = parseInt(patientId)
    timeslot = new Date(timeslot).toISOString()
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

      let dispoId = await prisma.dispo.findUnique({
        where: {
          doctorId_timeslot: {
            doctorId: doctorId,
            timeslot: timeslot,
          },
        },
        select: {
          dispoId: true,
        },
      })

      dispoId = dispoId.dispoId

      const rdv = await prisma.rdv.create({
        data: {
          patient: {
            connect: {
              patientId: patientId,
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
          motif: motif,
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
