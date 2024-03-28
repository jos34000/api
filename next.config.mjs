import { config } from "dotenv"
import { resolve } from "path"

let envFile
switch (process.env.NODE_ENV) {
  case "development":
    envFile = ".env.development"
    break
  case "test":
    envFile = ".env.test"
    break
  default:
    envFile = ".env.prod"
}

config({ path: resolve("/api", envFile) })

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

export default nextConfig
