import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { firstname, lastname, email, password, specialityId } = req.body
  const medecin = await prisma.medecin.create({
    data: {
      firstname,
      lastname,
      email,
      password,
      specialityId,
    },
  })

  res.status(200).json(medecin)
}
