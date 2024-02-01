// Imports
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()


// Requests

export default async function handler(req, res) {
  await prisma.user.create({
    data: {
      name: "Alice",
      email: "a@test.fr",
      profile: {
        create: { bio: "I like turtles" },
      },
    },
  })
  await res.status(200).json(user)
}
