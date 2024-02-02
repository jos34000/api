import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import React from "react"

export default async function createRdv(req, res) {
  const { patientId, doctorId, dispoId } = req.body
  const patient = Number(patientId)
  const doctor = Number(doctorId)
  const dispo = Number(dispoId)

  try {
    // Créer le rendez-vous
    const rdv = await prisma.rdv.create({
      data: {
        patient: {
          connect: {
            patientId: patient,
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
        motif: "test",
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
    res.status(500).json({ error: error.message })
  }
}
