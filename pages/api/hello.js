// export default (req, res) => {
//   res.status(200).json({ message: "Hello" })
// }

export default (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  return res.json({ message: "Hello" })
}
