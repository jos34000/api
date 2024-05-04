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
    allRdvs,
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
    allRdvs = await prisma.rdv.findMany({
      where: {
        doctorId: doctorId,
      },
      include: {
        dispo: true,
      },
    })

    rdvYear = allRdvs.filter((rdv) => {
      const rdvDate = new Date(rdv.dispo.date)
      return rdvDate >= startOfYear
    }).length
  } catch (error) {
    logError("read", "stats.js", "getRDVperYear", error)
    res.status(500).json({ error: "Une erreur est survenue" })
  }

  try {
    allRdvs = await prisma.rdv.findMany({
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

  try {
    allRdvs = await prisma.rdv.findMany({
      where: {
        doctorId: doctorId,
      },
      include: {
        dispo: true,
      },
    })

    rdvMonth = allRdvs.filter((rdv) => {
      const rdvDate = new Date(rdv.dispo.date)
      return rdvDate >= startOfCurrentMonth
    }).length
  } catch (error) {
    logError("read", "stats.js", "getRDVMonth", error)
    res.status(500).json({ error: "Une erreur est survenue" })
  }

  try {
    rdvCanceled = await prisma.rdv.count({
      where: {
        doctorId: doctorId,
        deletedAt: {
          not: null,
        },
        createdAt: {
          gte: startOfCurrentMonth,
        },
      },
    })
  } catch (error) {
    logError("read", "stats.js", "getRDVCanceled", error)
    res.status(500).json({ error: "Une erreur est survenue" })
  }

  try {
    rdvCanceledLastMonth = await prisma.rdv.count({
      where: {
        doctorId: doctorId,
        deletedAt: {
          not: null,
        },
        createdAt: {
          gte: startOfLastMonth,
          lt: startOfCurrentMonth,
        },
      },
    })
  } catch (error) {
    logError("read", "stats.js", "getRDVCanceledLastMonth", error)
    res.status(500).json({ error: "Une erreur est survenue" })
  }

  try {
    allRdvs = await prisma.rdv.findMany({
      where: {
        doctorId: doctorId,
      },
      include: {
        dispo: true,
      },
    })

    rdvLastYear = allRdvs.filter((rdv) => {
      const rdvDate = new Date(rdv.dispo.date)
      return rdvDate >= startOfLastYear && rdvDate <= endOfLastYear
    }).length
  } catch (error) {
    logError("read", "stats.js", "getRDVLastYear", error)
    res.status(500).json({ error: "Une erreur est survenue" })
  }

  let percentChangeYear =
    rdvLastYear !== 0
      ? Math.round(((rdvYear - rdvLastYear) / rdvLastYear) * 100)
      : rdvYear > 0
      ? 100
      : 0
  let percentChangeMonth =
    rdvLastMonth !== 0
      ? Math.round(((rdvMonth - rdvLastMonth) / rdvLastMonth) * 100)
      : rdvMonth > 0
      ? 100
      : 0

  let percentChangeCanceled =
    rdvCanceledLastMonth !== 0
      ? Math.round(
          ((rdvCanceled - rdvCanceledLastMonth) / rdvCanceledLastMonth) * 100
        )
      : rdvCanceled > 0
      ? 100
      : 0

  res.status(200).json({
    "Rdvs annuels": {
      Nombre: rdvYear,
      "Pourcentage de changement": percentChangeYear,
    },
    "Rdvs mensuels": {
      Nombre: rdvMonth,
      "Pourcentage de changement": percentChangeMonth,
    },
    "Rdvs annulés": {
      Nombre: rdvCanceled,
      "Pourcentage de changement": percentChangeCanceled,
    },
  })
}
