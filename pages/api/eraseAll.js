import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async (req, res) => {
  await prisma.rdv.deleteMany()
  await prisma.dispo.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.specialite.deleteMany()
  await prisma.history.deleteMany()
  await prisma.patient.deleteMany()
  res.status(200).json({ message: "Tables vidées" })
}
