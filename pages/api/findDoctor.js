import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (req.method === "GET") {
    const { specialite } = req.query
    if (specialite) {
      try {
        const specialiteId = parseInt(specialite, 10)
        const doctors = await prisma.doctor.findMany({
          where: {
            specialiteId: specialiteId,
          },
        })
        res.status(200).json(doctors)
      } catch (error) {
        logError("read", "findDoctor.js", "searchDoctor", error)
        return res.status(500).json({ error: "Une erreur est survenue" })
      }
    }
  } else {
    logError(
      "read",
      "findDoctor.js",
      "searchDoctor",
      "Méthode non autorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
