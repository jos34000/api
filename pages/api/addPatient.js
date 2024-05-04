import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { token, firstName, lastName, age, email, timeslot } = req.body

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

      const patient = await prisma.patient.create({
        data: {
          firstname: firstName,
          lastname: lastName,
          email: email,
          age: parseInt(age),
        },
      })

      const patientId = patient.patientId

      const dispo = await prisma.dispo.create({
        data: {
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
        },
      })

      res.status(200).json({ message: "Patient ajouté avec succès" })
    } catch (error) {
      logError("create", "addPatient.js", "importManuallyAPatient", error)
      res.status(500).json({ error: "Une erreur est survenue" })
    }
  } else {
    logError(
      "create",
      "addPatient.js",
      "importManuallyAPatient",
      "Méthode non authorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
