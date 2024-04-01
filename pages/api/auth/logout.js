import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { token } = req.body

    try {
      const patient = await prisma.patient.update({
        where: {
          token,
        },
        data: {
          token: null,
        },
      })

      return res.status(200).json({ success: true })
    } catch (error) {
      logError("update", "logout.js", "logout", error)
      return res.status(500).json({ success: false })
    }
  } else {
    logError(
      "update",
      "logout.js",
      "logout",
      "Méthode de requête non valide : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
