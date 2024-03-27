import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import { faker } from "@faker-js/faker"
import logError from "@/logs/logError.js"


export default async (req, res) => {
  let disposId = []
  while (disposId.length === 0) {
    const doctorId = faker.number.int({ min: 2587, max: 2826 })
    disposId = await prisma.dispo.findMany({
      where: {
        doctorId: doctorId,
      },
    })
  }
  const response = faker.helpers.arrayElement(disposId)
  const dispoId = response.dispoId
  res.json({ dispoid: dispoId })
}
