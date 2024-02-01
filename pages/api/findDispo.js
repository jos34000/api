import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (req.method === "GET") {
    const { doctor } = req.query
    let doctorId = Number(doctor)
    try {
      const dispos = await prisma.dispo.findMany({
        where: {
          doctorId: doctorId,
        },
        select: {
          timeslot: true,
        },
      })

      res.json(dispos)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Internal Server Error" })
    }
  }
}
