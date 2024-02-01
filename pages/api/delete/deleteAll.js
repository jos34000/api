const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

export default async function deleteAllData() {
  try {
    // Supprimer toutes les entrées dans la table RDV
    await prisma.rDV.deleteMany()

    // Supprimer toutes les entrées dans la table Disponibilites
    await prisma.disponibilites.deleteMany()

    // Supprimer toutes les entrées dans la table Patient
    await prisma.patient.deleteMany()

    // Supprimer toutes les entrées dans la table History
    await prisma.history.deleteMany()

    // Supprimer toutes les entrées dans la table Praticien
    await prisma.praticien.deleteMany()

    // Supprimer toutes les entrées dans la table Account
    await prisma.account.deleteMany()

    // Supprimer toutes les entrées dans la table Specialite
    await prisma.specialite.deleteMany()

    console.log("Toutes les entrées ont été supprimées avec succès.")
  } catch (error) {
    console.error("Erreur lors de la suppression des entrées :", error)
  } finally {
    await prisma.$disconnect() // Assurez-vous de déconnecter le client Prisma à la fin.
  }
}

deleteAllData()
