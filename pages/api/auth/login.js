import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import jwt from "jsonwebtoken"
import logError from "@/logs/logError.js"
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body
    try {
      const patient = await prisma.patient.findUnique({
        where: {
          email,
        },
      })
      const hashedPassword = bcrypt.compareSync(password, patient.password)

      if (!patient || !hashedPassword) {
        logError("read", "login.js", "LOGIN", res.message)
        return res.status(401).json({ success: false })
      }
      const token = jwt.sign({ id: patient.patientId }, process.env.TOKEN_KEY, {
        expiresIn: "1h",
      })
      const patientId = patient.patientId
      await prisma.patient.update({
        where: {
          patientId: patientId,
        },
        data: {
          token: token,
        },
      })

      return res.status(200).json({ success: true, token })
    } catch (error) {
      logError("read", "login.js", "LOGIN", error)
      return res.status(500).json({ success: false })
    }
  } else {
    logError(
      "read",
      "login.js",
      "LOGIN",
      "Méthode de requête non valide : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
