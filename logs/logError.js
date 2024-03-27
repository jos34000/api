import fs from "fs"
import path from "path"

function logError(crud, fileName, functionName, error) {
  const logFilePath = path.join(
    "/",
    "api",
    "logs",
    crud,
    fileName,
    `${functionName}.log`
  )
  const logDirPath = path.join("/", "api", "logs", crud, fileName)

  if (!fs.existsSync(logDirPath)) {
    fs.mkdirSync(logDirPath, { recursive: true })
  }
  const now = new Date()
  const date = now.toLocaleDateString("fr-FR")
  const time = now.toLocaleTimeString("fr-FR")
  const timestamp = `${date} ${time}`
  const errorMessage = error.toString()
  const logMessage = `-------------------------------\n${timestamp} - ERROR in ${fileName} ${functionName}: \n${errorMessage}\n\n`

  try {
    fs.appendFileSync(logFilePath, logMessage)
  } catch (err) {
    console.error("Failed to write to log file:", err)
  }
}

export default logError
