import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { token, search } = req.body

    let doctorId = await prisma.doctor.findUnique({
      where: {
        token: token,
      },
      select: {
        doctorId: true,
      },
    })

    doctorId = doctorId.doctorId

    try {
      const patients = await prisma.rdv.findMany({
        where: {
          doctorId: doctorId,
          OR: [
            {
              patient: {
                firstname: {
                  contains: search,
                },
              },
            },
            {
              patient: {
                lastname: {
                  contains: search,
                },
              },
            },
          ],
        },
        include: {
          patient: true,
        },
        take: 5,
      })
      res.status(200).send(patients)
    } catch (error) {
      logError("read", "findPatient.js", "searchPatient", error)
      res.status(500).json({ error: "Une erreur est survenue" })
    }
  } else {
    logError(
      "read",
      "findPatient.js",
      "searchPatient",
      "Méthode non authorisée : " + req.method
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
