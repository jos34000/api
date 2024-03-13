// hello.test.js
import { jest } from "@jest/globals"
import handler from "../hello" // Ajustez le chemin d'importation selon votre structure de projet

describe("hello API handler", () => {
  it("should return a greeting message", async () => {
    const json = jest.fn()
    const setHeader = jest.fn()
    const req = {} // simuler l'objet de requête si nécessaire
    const res = { setHeader, json }

    // Appeler le gestionnaire et passer les objets req et res simulés
    await handler(req, res)

    // Vérifier que setHeader a été appelé correctement
    expect(setHeader).toHaveBeenCalledWith("Access-Control-Allow-Origin", "*")
    // Vérifier que le bon message est retourné
    expect(json).toHaveBeenCalledWith({ message: "Hello" })
  })
})
