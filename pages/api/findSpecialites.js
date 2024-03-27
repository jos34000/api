import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function getSpecialites(req, res) {
  if (req.method === "GET") {
    try {
      const specialites = await prisma.specialite.findMany({
        select: {
          specialiteId: true,
          specialite: true,
        },
      })
      res.status(200).json(specialites)
    } catch (error) {
      logError("read", "findSpecialites.js", "search-specialites", error)
      res.status(500).json({ error: "Une erreur est survenue" })
    }
  } else {
    logError(
      "read",
      "findSpecialites.js",
      "search-specialites",
      "Méthode non authorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
