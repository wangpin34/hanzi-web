import { access, cp, mkdir, rename, rm } from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve(process.cwd(), 'dist')
const clientDir = path.join(distDir, 'client')
const tempDir = path.resolve(process.cwd(), '.dist-static-export')

async function main() {
  await access(clientDir)
  await rm(tempDir, { force: true, recursive: true })
  await mkdir(tempDir, { recursive: true })
  await cp(clientDir, tempDir, { recursive: true })
  await rm(distDir, { force: true, recursive: true })
  await rename(tempDir, distDir)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})