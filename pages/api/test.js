import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import React from "react"

export default async function test(req, res) {
  const rdv = await prisma.rdv.create({
    data: {
      patient: {
        connect: {
          patientId: 1,
        },
      },
      doctor: {
        connect: {
          doctorId: 2,
        },
      },
      dispo: {
        connect: {
          dispoId: 3,
        },
      },
      motif: "Votre motif ici",
    },
  })
  res.json(rdv)
}
