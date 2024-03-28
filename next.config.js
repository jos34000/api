import { config } from "dotenv"
import { resolve } from "path"

let envFile
switch (process.env.NODE_ENV) {
  case "dev":
    envFile = ".env.dev"
    break
  case "home":
    envFile = ".env.home"
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
