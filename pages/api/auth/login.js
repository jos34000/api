import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { email, password } = req.body

    try {
      const user = await prisma.patient.findUnique({
        where: {
          email,
        },
      })

      if (!user || user.password !== password) {
        return res
          .status(401)
          .json({ success: false, error: "Invalid credentials" })
      }

      return res.status(200).json({ success: true })
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" })
  }
}
