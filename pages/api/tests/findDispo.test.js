// findDispo.test.js
import { jest } from "@jest/globals"
import handler from "../findDispo" // Ajustez le chemin d'importation selon votre structure de projet
import { PrismaClient } from "@prisma/client"
import * as dateFns from "date-fns"

// Simuler PrismaClient et dateFns
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    dispo: {
      findMany: jest.fn().mockResolvedValue([
        {
          /* objet dispo simulé */
        },
      ]),
    },
  })),
}))

jest.mock("date-fns", () => ({
  parse: jest.fn(),
  startOfDay: jest.fn(),
  endOfDay: jest.fn(),
}))

describe("findDispo API function", () => {
  beforeEach(() => {
    // Réinitialiser les simulations avant chaque test
    jest.clearAllMocks()
  })

  it("should find dispos successfully", async () => {
    // Configurer les fonctions mock de date-fns
    dateFns.parse.mockReturnValue(new Date())
    dateFns.startOfDay.mockReturnValue(new Date())
    dateFns.endOfDay.mockReturnValue(new Date())

    // Simuler la requête et la réponse
    const req = {
      method: "GET",
      query: { doctor: "1", date: "2022-03-28" },
    }
    const json = jest.fn()
    const setHeader = jest.fn()
    const res = { json, setHeader }

    await handler(req, res)

    expect(json).toHaveBeenCalledWith([
      {
        /* objet dispo simulé */
      },
    ])
    // Plus d'assertions peuvent être ajoutées ici pour vérifier le comportement attendu
  })

  it("should return an error if date is missing", async () => {
    const req = {
      method: "GET",
      query: { doctor: "1" }, // date manquante
    }
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const setHeader = jest.fn()
    const res = { json, status, setHeader }

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({ message: "La date est requise" })
  })
})
