import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"

export default async (req, res) => {
  const patienthistoryId = req.body.ids

  try {
    await prisma.patienthistory.deleteMany({
      where: {
        patienthistoryId: {
          in: patienthistoryId,
        },
      },
    })
  } catch (error) {
    logError(
      "delete",
      "deletePatientHistory.js",
      "erase-patient-history",
      error
    )
    return res.status(400).json({ error: "Une erreur est survenue" })
  }
  res.status(200).json({ message: "Antécédents supprimés" })
}
