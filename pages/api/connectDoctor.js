import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import jwt from "jsonwebtoken"
import logError from "@/logs/logError.js"
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, mdp } = req.body

    try {
      const doctor = await prisma.doctor.findUnique({
        where: {
          email,
        },
      })
      const hashedMdp = bcrypt.compare(doctor.password, mdp)

      if (!doctor || !hashedMdp) {
        logError("read", "connectDoctor.js", "LOGIN", res.message)
        return res.status(401).json({ success: false })
      }
      const token = jwt.sign({ id: doctor.doctorId }, process.env.TOKEN_KEY, {
        expiresIn: "1h",
      })
      const doctorId = doctor.doctorId
      await prisma.doctor.update({
        where: {
          doctorId: doctorId,
        },
        data: {
          token: token,
        },
      })

      return res.status(200).json({ success: true, token })
    } catch (error) {
      logError("read", "connectDoctor.js", "LOGIN", error)
      return res.status(500).json({ success: false })
    }
  } else {
    logError(
      "read",
      "connectDoctor.js",
      "LOGIN",
      "Méthode de requête non valide : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
