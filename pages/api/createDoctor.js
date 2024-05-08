import { PrismaClient } from "@prisma/client"
import {
  addMinutes,
  setHours,
  setMinutes,
  setSeconds,
  startOfWeek,
  addDays,
  addWeeks,
} from "date-fns"

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

      const startHour = 8
      const endHour = 19
      const interval = 30
      const days = 5
      const weeks = 4 // nombre de semaines pour lesquelles créer des disponibilités

      for (let w = 0; w < weeks; w++) {
        let date = startOfWeek(addWeeks(new Date(), w), { weekStartsOn: 1 })

        for (let i = 0; i < days; i++) {
          let timeslot = setSeconds(setMinutes(setHours(date, startHour), 0), 0)

          while (timeslot.getHours() < endHour) {
            await prisma.dispo.create({
              data: {
                doctorId: doctor.doctorId,
                timeslot: timeslot,
                isReserved: false,
              },
            })

            timeslot = addMinutes(timeslot, interval)
          }

          date = addDays(date, 1)
        }
      }

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
