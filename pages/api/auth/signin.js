import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  if (req.method === "POST") {
    let { email, password, nom, prenom, age } = req.body
    age = parseInt(age)
    password = bcrypt.hashSync(password, 10)

    try {
      const patient = await prisma.patient.create({
        data: {
          email: email,
          password: password,
          firstname: prenom,
          lastname: nom,
          age: age,
        },
      })

      return res.status(200).json({ success: true })
    } catch (error) {
      logError("create", "signin.js", "SignIn", error)
      return res.status(500).json({ success: false })
    }
  } else {
    logError(
      "create",
      "signin.js",
      "SignIn",
      "Méthode de requête non autorisée" + req.method
    )

    return res.status(400).json({ error: "Une erreur est survenue" })
  }
}
