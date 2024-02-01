import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { speciality } = req.body
  const newSpeciality = await prisma.speciality.create({
    data: {
      speciality,
    },
  })

  res.status(200).json(newSpeciality)
}
