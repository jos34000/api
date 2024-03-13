// createRdv.test.js
import { jest } from "@jest/globals"
import createRdv from "../createRdv" // Ajustez le chemin d'importation selon votre structure de projet
import { PrismaClient } from "@prisma/client"

// Simuler PrismaClient
jest.mock("@prisma/client", () => {
  const originalModule = jest.requireActual("@prisma/client")

  return {
    __esModule: true,
    ...originalModule,
    PrismaClient: jest.fn(() => ({
      rdv: {
        create: jest.fn().mockResolvedValue({
          /* objet rdv simulé */
        }),
      },
      dispo: {
        update: jest.fn().mockResolvedValue({
          /* objet dispo simulé */
        }),
      },
    })),
  }
})

describe("createRdv API function", () => {
  it("should create an appointment successfully", async () => {
    // Simuler la requête et la réponse
    const req = { body: { patientId: "1", doctorId: "2", dispoId: "3" } }
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status }

    await createRdv(req, res)

    expect(status).toHaveBeenCalledWith(200)
    // Plus d'assertions peuvent être ajoutées ici pour vérifier le comportement attendu
  })

  it("should handle errors", async () => {
    // Réinitialiser la simulation pour renvoyer une erreur
    PrismaClient.mockImplementationOnce(() => ({
      rdv: {
        create: jest.fn().mockRejectedValue(new Error("Error creating RDV")),
      },
      dispo: {
        update: jest.fn(),
      },
    }))

    const req = { body: { patientId: "1", doctorId: "2", dispoId: "3" } }
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status }

    await createRdv(req, res)

    expect(status).toHaveBeenCalledWith(500)
    // Tester la gestion des erreurs
  })
})
