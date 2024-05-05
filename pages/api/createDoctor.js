import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  if (req.method === "POST") {
    let { email, mdp, nom, prenom, specialite } = req.body
    const specialiteId = parseInt(specialite)
    mdp = bcrypt.hashSync(mdp, 10)
    try {
      const doctor = await prisma.doctor.create({
        data: {
          email: email,
          password: mdp,
          firstname: prenom,
          lastname: nom,
          specialite: {
            connect: {
              specialiteId: specialiteId,
            },
          },
        },
      })

      return res.status(200).json({ success: true })
    } catch (error) {
      logError("create", "createDoctor.js", "SignIn", error)
      return res.status(500).json({ success: false })
    }
  } else {
    logError(
      "create",
      "createDoctor.js",
      "SignIn",
      "Méthode de requête non autorisée" + req.method
    )

    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
