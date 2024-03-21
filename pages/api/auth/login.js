import NextCors from "nextjs-cors"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
  await NextCors(req, res, {
    origin: "*",
    methods: ["POST"],
  })

  if (req.method === "POST") {
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
      const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY, {
        expiresIn: "1h",
      })

      return res.status(200).json({ success: true, token })
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" })
  }
}
