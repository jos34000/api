// findSpecialites.test.js
import { jest } from "@jest/globals"
import getSpecialites from "../findSpecialites" // Ajustez le chemin d'importation selon votre structure de projet
import { PrismaClient } from "@prisma/client"

// Simuler PrismaClient
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    specialite: {
      findMany: jest.fn().mockResolvedValue([
        {
          /* objet spécialité simulé */
        },
      ]),
    },
  })),
}))

describe("getSpecialites API function", () => {
  beforeEach(() => {
    // Réinitialiser les simulations avant chaque test
    jest.clearAllMocks()
  })

  it("should fetch all specialities successfully", async () => {
    // Simuler la requête et la réponse
    const req = {}
    const json = jest.fn()
    const setHeader = jest.fn()
    const res = { json, setHeader }

    await getSpecialites(req, res)

    expect(json).toHaveBeenCalledWith([
      {
        /* objet spécialité simulé */
      },
    ])
    // Plus d'assertions peuvent être ajoutées ici pour vérifier le comportement attendu
  })
})
