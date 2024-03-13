import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, nom, prenom } = req.body

    try {
      const patient = await prisma.patient.create({
        data: {
          email,
          password,
          name,
          surname,
        },
      })

      return res.status(200).json({ success: true, user })
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" })
  }
}
