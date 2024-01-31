import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { medecinId, date, startAt, endAt, isReserved } = req.body
  const disponibility = await prisma.disponibility.create({
    data: {
      medecinId,
      date,
      startAt,
      endAt,
      isReserved,
    },
  })

  res.status(200).json(disponibility)
}
