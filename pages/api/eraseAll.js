import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async (req, res) => {
  try {
    await prisma.rdv.deleteMany()
    await prisma.dispo.deleteMany()
    await prisma.doctor.deleteMany()
    await prisma.specialite.deleteMany()
    await prisma.history.deleteMany()
    await prisma.patient.deleteMany()
  } catch (error) {
    logError("delete", "eraseAll.js", "eraseEntries", error)
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
  res.status(200).json({ message: "Tables vidées" })
}
