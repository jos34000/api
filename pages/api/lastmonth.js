import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async function handler(req, res) {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1)
  const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const token = req.body.token

  let doctorId,
    doctor,
    rdvYear,
    rdvLastMonth,
    rdvMonth,
    rdvCanceled,
    rdvCanceledLastMonth,
    rdvLastYear

  try {
    doctor = await prisma.doctor.findUnique({
      where: {
        token: token,
      },
      select: {
        doctorId: true,
      },
    })
    doctorId = doctor.doctorId
  } catch (error) {
    logError("read", "stats.js", "getDoctorId", error)
    res.status(500).json({ error: "Une erreur est survenue" })
  }

  try {
    let allRdvs = await prisma.rdv.findMany({
      where: {
        doctorId: doctorId,
      },
      include: {
        dispo: true,
      },
    })

    rdvLastMonth = allRdvs.filter((rdv) => {
      const rdvDate = new Date(rdv.dispo.date)
      return rdvDate >= startOfLastMonth && rdvDate < startOfCurrentMonth
    }).length
  } catch (error) {
    logError("read", "stats.js", "getRDVLastMonth", error)
    res.status(500).json({ error: "Une erreur est survenue" })
  }

  res.status(200).json(rdvLastMonth)
}
