// Imports

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

// Function

export default async function handler(req, res) {
  const deleteDispo = await prisma.disponibilites.delete({
    where: {
      id: 2,
    },
  })

  res.json(deleteDispo)
}
