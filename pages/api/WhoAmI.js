import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const token = req.body.token

    try {
      let doctor = await prisma.doctor.findUnique({
        where: {
          token: token,
        },
        select: {
          lastname: true,
        },
      })

      res.status(200).send(doctor)
    } catch (error) {
      logError("read", "WhoAmI.js", "findDoctorLastname", error)
      res.status(500).json({ error: "Une erreur est survenue" })
    }
  } else {
    logError(
      "read",
      "WhoAmI.js",
      "findDoctorLastname",
      "Méthode non authorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
