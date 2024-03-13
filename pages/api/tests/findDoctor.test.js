// findDoctor.test.js
import { jest } from "@jest/globals"
import handler from "../findDoctor" // Ajustez le chemin d'importation selon votre structure de projet
import { PrismaClient } from "@prisma/client"

// Simuler PrismaClient
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    doctor: {
      findMany: jest.fn().mockResolvedValue([
        {
          /* objet doctor simulé */
        },
      ]),
    },
  })),
}))

describe("findDoctor API function", () => {
  beforeEach(() => {
    // Réinitialiser les simulations avant chaque test
    jest.clearAllMocks()
  })

  it("should find doctors successfully", async () => {
    // Simuler la requête et la réponse
    const req = {
      method: "GET",
      query: { specialite: "1" },
    }
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const setHeader = jest.fn()
    const res = { json, status, setHeader }

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith([
      {
        /* objet doctor simulé */
      },
    ])
    // Plus d'assertions peuvent être ajoutées ici pour vérifier le comportement attendu
  })

  it("should return method not allowed if method is not GET", async () => {
    const req = { method: "POST" } // Méthode non GET
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const setHeader = jest.fn()
    const res = { json, status, setHeader }

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
    expect(json).toHaveBeenCalledWith({ message: "Méthode non autorisée" })
  })
})
