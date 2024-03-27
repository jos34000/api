import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import NextCors from "nextjs-cors"
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  await NextCors(req, res, {
    origin: "*",
    methods: ["POST"],
  })
  if (req.method === "GET") {
    try {
      let histories = await prisma.history.findMany({
        select: {
          historyId: true,
          antecedent: true,
        },
      })
      res.status(200).send(histories)
    } catch (error) {
      logError("read", "findHistory.js", "searchHistory", error)
      res.status(500).json({ error: "Une erreur est survenue" })
    }
  } else {
    logError(
      "read",
      "findHistory.js",
      "searchHistory",
      "Méthode non autorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
