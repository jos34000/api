// Imports

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

// Request to create a patient

export default async function handler(req, res) {
  const { firstname, lastname, age, email, password } = req.body
  const patient = await prisma.patient.create({
    data: {
      firstname,
      lastname,
      age,
      email,
      password,
    },
  })

  res.status(200).json(patient)
}
