import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import logError from "@/logs/logError.js"
import { faker } from "@faker-js/faker"
import fs from "fs"

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

  /*   const timeslots = [
    "8h - 9h",
    "9h - 10h",
    "10h - 11h",
    "11h - 12h",
    "12h - 13h",
    "14h - 15h",
    "15h - 16h",
    "16h - 17h",
    "17h - 18h",
    "18h - 19h",
    "19h - 20h",
  ] */

  /*   for (let i = 0; i < 500; i++) {
    try {
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
    } catch (error) {
      logError("create", "addEntry.js", "createPatient", error)
    }
  }

  for (let i = 0; i < antecedents.length; i++) {
    try {
      await prisma.history.create({
        data: {
          antecedent: antecedents[i],
        },
      })
    } catch (error) {
      logError("create", "addEntry.js", "createAntecedents", error)
    }
  } */

  for (let i = 0; i < specialites.length; i++) {
    try {
      await prisma.specialite.create({
        data: {
          specialite: specialites[i],
        },
      })
    } catch (error) {
      logError("create", "addEntry.js", "createSpecialites", error)
    }
  }

  /*  for (let i = 0; i < 100; i++) {
    const firstEntry = await prisma.specialite.findFirst({
      orderBy: {
        specialiteId: "asc",
      },
    })
    const firstId = firstEntry.specialiteId

    const lastEntry = await prisma.specialite.findFirst({
      orderBy: {
        specialiteId: "desc",
      },
    })
    const lastId = lastEntry.specialiteId

    const lastname = faker.person.lastName()
    const firstname = faker.person.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const specialiteId = faker.number.int({ min: firstId, max: lastId })
    try {
      await prisma.doctor.create({
        data: {
          lastname: lastname,
          firstname: firstname,
          email: email,
          password: password,
          specialiteId: specialiteId,
        },
      })
    } catch (error) {
      logError("create", "addEntry.js", "createDoctor", error)
    }
  } */

  for (let i = 0; i < 1000; i++) {
    const firstEntry = await prisma.doctor.findFirst({
      orderBy: {
        doctorId: "asc",
      },
    })
    const firstId = firstEntry.doctorId

    const lastEntry = await prisma.doctor.findFirst({
      orderBy: {
        doctorId: "desc",
      },
    })
    const lastId = lastEntry.doctorId

    const doctorId = faker.number.int({ min: firstId, max: lastId })
    const timeslot = faker.date.between({
      from: "2024-03-01T00:00:00.000Z",
      to: "2024-06-01T00:00:00.000Z",
    })
    try {
      await prisma.dispo.create({
        data: {
          doctorId: doctorId,
          timeslot: timeslot,
        },
      })
    } catch (error) {
      logError("create", "addEntry.js", "createDispo", error)
    }
  }

  /* for (let i = 0; i < 1000; i++) {
    const firstPatient = await prisma.patient.findFirst({
      orderBy: {
        patientId: "asc",
      },
    })
    const patientFirst = firstPatient.patientId

    const lastPatient = await prisma.patient.findFirst({
      orderBy: {
        patientId: "desc",
      },
    })
    const patientLast = lastPatient.patientId

    const firstDoctor = await prisma.doctor.findFirst({
      orderBy: {
        doctorId: "asc",
      },
    })
    const doctorFirst = firstDoctor.doctorId

    const lastDoctor = await prisma.doctor.findFirst({
      orderBy: {
        doctorId: "desc",
      },
    })
    const doctorLast = lastDoctor.doctorId

    const patientId = faker.number.int({ min: patientFirst, max: patientLast })
    let doctorId = faker.number.int({ min: doctorFirst, max: doctorLast })
    let disposId = []
    while (disposId.length === 0) {
      doctorId = faker.number.int({ min: doctorFirst, max: doctorLast })
      disposId = await prisma.dispo.findMany({
        where: {
          doctorId: doctorId,
        },
      })
    }
    const response = faker.helpers.arrayElement(disposId)
    const dispoId = response.dispoId

    try {
      await prisma.rdv.create({
        data: {
          motif: "test",
          patient: {
            connect: {
              patientId: patientId,
            },
          },
          doctor: {
            connect: {
              doctorId: doctorId,
            },
          },
          dispo: {
            connect: {
              dispoId: dispoId,
            },
          },
        },
      })
    } catch (error) {
      logError("create", "addEntry.js", "createRDV", error)
    }
  } */

  res.status(200).json({ message: "Données générées et insérées avec succès" })
}
