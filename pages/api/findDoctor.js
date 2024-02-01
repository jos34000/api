import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (req.method === "GET") {
    let doctors
    const { specialite } = req.query
    if (specialite) {
      const specialiteId = parseInt(specialite, 10)
      doctors = await prisma.doctor.findMany({
        where: {
          specialiteId: {
            equals: specialiteId,
          },
        },
      })
    } else {
      doctors = await prisma.doctor.findMany()
    }
    res.status(200).json(doctors)
    console.log(doctors)
  } else {
    res.status(405).json({ message: "Méthode non autorisée" })
  }
}
