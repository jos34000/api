import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (req.method === "GET") {
    const { specialite } = req.query
    if (specialite) {
      const specialiteId = parseInt(specialite, 10)
      const doctors = await prisma.doctor.findMany({
        where: {
          specialiteId: specialiteId,
        },
      })
      res.status(200).json(doctors)
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" })
  }
}
