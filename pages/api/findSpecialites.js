import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function getSpecialites(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  const specialites = await prisma.specialite.findMany({})
  res.json(specialites)
}
