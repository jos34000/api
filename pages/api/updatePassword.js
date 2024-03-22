import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default (req, res) => {
  const token = req.body.token
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword
}
