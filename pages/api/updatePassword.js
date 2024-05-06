import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import NextCors from "nextjs-cors"
import logError from "@/logs/logError.js"
import bcrypt from "bcryptjs"

export default async (req, res) => {
  await NextCors(req, res, {
    origin: "*",
    methods: ["POST"],
  })
  const cookie = req.body.cookie
  const oldMdp = req.body.oldMdp
  let newMdp = req.body.newMdp

  const oldMdpBdd = await prisma.patient.findUnique({
    where: {
      token: cookie,
    },
    select: {
      password: true,
    },
  })

  const hashedOldPassword = bcrypt.compare(oldMdp, oldMdpBdd.password)
  newMdp = bcrypt.hashSync(newMdp, 10)

  if (!hashedOldPassword) {
    logError(
      "update",
      "updatePassword.js",
      "testIfPasswordsSame",
      "Les mdp ne sont pas identiques"
    )
    res.status(500).json({ message: "L'ancien mdp ne correspond pas" })
  }
  try {
    await prisma.patient.update({
      where: {
        token: cookie,
      },
      data: {
        password: newMdp,
      },
    })
    return res.status(200).json({ success: true })
  } catch (error) {
    logError("update", "updatePassword.js", "updating-password", error)
  }
}
