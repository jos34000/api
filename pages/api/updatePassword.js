import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import NextCors from "nextjs-cors"

export default async (req, res) => {
  await NextCors(req, res, {
    origin: "*",
    methods: ["POST"],
  })
  const cookie = req.body.cookie
  const oldMdp = req.body.oldMdp
  const newMdp = req.body.newMdp

  const oldMdpBdd = await prisma.patient.findUnique({
    where: {
      token: cookie,
    },
    select: {
      password: true,
    },
  })

  if (oldMdp !== oldMdpBdd.password) {
    res.status(500).json({ message: "L'ancien mdp ne correspond pas" })
  } else {
    await prisma.patient.update({
      where: {
        token: cookie,
      },
      data: {
        password: newMdp,
      },
    })
    return res
      .status(200)
      .json({ success: true, message: "Mot de passe modifié" })
  }
}
