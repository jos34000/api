import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { patientId, medecinId, date, startAt, endAt } = req.body
  const rdv = await prisma.rdv.create({
    data: {
      patientId,
      medecinId,
      date,
      startAt,
      endAt,
    },
  })

  res.status(200).json(rdv)
}
