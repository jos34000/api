import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import NextCors from "nextjs-cors"

export default async function handler(req, res) {
  await NextCors(req, res, {
    origin: "*",
    methods: ["POST"],
  })
  if (req.method === "POST") {
    const token = req.body.token

    let patientId = await prisma.patient.findUnique({
      where: {
        token: token,
      },
      select: {
        patientId: true,
      },
    })

    try {
      const patienthistory = await prisma.patienthistory.findMany({
        where: {
          patientId: patientId.patientId,
        },
        include: {
          history: true,
        },
        orderBy: {
          historyId: "asc",
        },
      })
      res.status(200).send(patienthistory)
      console.log("ok")
    } catch (error) {
      console.log(error)

      res.status(500).json({ error: error })
    }
  }
}
