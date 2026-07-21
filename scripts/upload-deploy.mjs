import { Client } from 'basic-ftp'
import fs from 'node:fs'
import path from 'node:path'
import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
config({ path: path.join(root, '.env.local') })

const host = process.env.FTP_HOST
const user = process.env.FTP_USER
const password = process.env.FTP_PASSWORD
const remoteDir = process.env.FTP_REMOTE_DIR || '/htdocs'
const localDir = path.join(root, 'dist', 'site')

if (!host || !user || !password) {
  console.log('FTP upload skipped (set FTP_HOST, FTP_USER, FTP_PASSWORD in .env.local to upload automatically).')
  process.exit(0)
}

if (!fs.existsSync(localDir)) {
  console.error('Missing dist/site — run npm run build:deploy first.')
  process.exit(1)
}

const client = new Client(120_000)
client.ftp.verbose = false

try {
  console.log(`Uploading to ${host}${remoteDir} ...`)
  await client.access({ host, user, password, secure: false })
  await client.ensureDir(remoteDir)
  await client.cd(remoteDir)
  await client.uploadFromDir(localDir)
  try {
    await client.remove('index2.html')
  } catch {
    // default InfinityFree placeholder; optional
  }
  console.log('FTP upload complete.')
} catch (err) {
  console.error('FTP upload failed:', err.message)
  process.exit(1)
} finally {
  client.close()
}
