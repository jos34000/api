import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (req.method === "GET") {
    try {
      const history = await prisma.history.findMany({
        select: {
          historyId: true,
          antecedent: true,
        },
        orderBy: {
          historyId: "asc",
        },
      })
      res.status(200).json(history)
    } catch (e) {
      res.status(405).json({ message: "Méthode non autorisée" })
    }
  }
}
