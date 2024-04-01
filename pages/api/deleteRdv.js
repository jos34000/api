import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async (req, res) => {
  const rdvId = req.body.rdvIds
  const dispoId = req.body.dispoIds

  try {
    await prisma.rdv.deleteMany({
      where: {
        rdvId: {
          in: rdvId,
        },
      },
    })
  } catch (error) {
    logError("delete", "deleteRdv.js", "erase-rdv", error)
    return res.status(400).json({ error: "Une erreur est survenue" })
  }

  try {
    await prisma.dispo.updateMany({
      where: {
        dispoId: {
          in: dispoId,
        },
      },
      data: {
        isReserved: false,
      },
    })
  } catch (error) {
    logError("update", "deleteRdv.js", "update-disponibility", error)
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
  res.status(200).json({ message: "Rdv supprimés" })
}
