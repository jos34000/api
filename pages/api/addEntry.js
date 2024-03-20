import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"
const prisma = new PrismaClient()

export default async (req, res) => {
  const antecedents = [
    "Aucun",
    "Diabète",
    "Hypertension artérielle",
    "Maladie cardiaque",
    "Asthme",
    "Cancer",
    "Maladie rénale chronique",
    "Maladie pulmonaire obstructive chronique",
    "Epilepsie",
    "Maladie du foie",
    "Accident vasculaire cérébral",
    "Maladie de la thyroïde",
    "Maladie mentale",
    "VIH/SIDA",
    "Hépatite B",
    "Hépatite C",
  ]

  const specialites = [
    "Cardiologie",
    "Dermatologie",
    "Généraliste",
    "Gastro-entérologue",
    "Gynécologue-Obstétricien",
    "Pédiatre",
    "Psychologue",
    "Kinésithérapeute",
    "Pédiatrie",
    "ORL",
    "Ophtalmologue",
  ]

  for (let i = 0; i < 10; i++) {
    const lastname = faker.person.lastName()
    const firstname = faker.person.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const age = faker.number.int({ max: 100 })

    await prisma.patient.create({
      data: {
        lastname: lastname,
        firstname: firstname,
        email: email,
        password: password,
        age: age,
      },
    })
  }

  for (let i = 0; i < antecedents.length; i++) {
    await prisma.history.create({
      data: {
        antecedent: antecedents[i],
      },
    })
  }

  for (let i = 0; i < specialites.length; i++) {
    await prisma.specialite.create({
      data: {
        specialite: specialites[i],
      },
    })
  }

  for (let i = 0; i < 10; i++) {
    const firstEntry = await prisma.specialite.findFirst({
      orderBy: {
        id: "asc",
      },
    })
    const firstId = firstEntry.id

    const lastEntry = await prisma.specialite.findFirst({
      orderBy: {
        id: "desc",
      },
    })
    const lastId = lastEntry.id

    const lastname = faker.person.lastName()
    const firstname = faker.person.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const specialite = faker.helpers.arrayElement(specialites)
    const specialiteId = faker.number.int({ min: firstId, max: lastId })

    await prisma.doctor.create({
      data: {
        lastname: lastname,
        firstname: firstname,
        email: email,
        password: password,
        specialiteId: specialiteId,
      },
    })

    res
      .status(200)
      .json({ message: "Données générées et insérées avec succès" })
  }
}
