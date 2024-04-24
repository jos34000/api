import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const token = req.body.token

    let doctorId = await prisma.doctor.findUnique({
      where: {
        token: token,
      },
      select: {
        doctorId: true,
      },
    })

    try {
      const patients = await prisma.rdv.findMany({
        where: {
          doctorId: doctorId.doctorId,
        },
        include: {
          patient: true,
        },
      })
      res.status(200).send(patients)
    } catch (error) {
      logError("read", "findPatients.js", "searchPatient", error)
      res.status(500).json({ error: "Une erreur est survenue" })
    }
  } else {
    logError(
      "read",
      "findPatients.js",
      "searchPatient",
      "Méthode non authorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
