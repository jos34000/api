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
      res.status(500).json({ error: error })

      console.log(error)
    }
  }
}
