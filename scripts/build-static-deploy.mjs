import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
loadEnv({ path: path.join(root, '.env.local') })
const outDir = path.join(root, 'out')
const distDir = path.join(root, 'dist', 'site')
const backupDir = path.join(root, '.deploy-backup')

const moveAside = ['app/api', 'app/actions']

function run(cmd, args, env = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, ...env },
    shell: process.platform === 'win32',
  })
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} failed`)
  }
}

function rimraf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true })
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name)
    const to = path.join(dest, entry.name)
    if (entry.isDirectory()) copyDir(from, to)
    else fs.copyFileSync(from, to)
  }
}

function movePath(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  if (process.platform === 'win32') {
    copyDir(src, dest)
    rimraf(src)
  } else {
    fs.renameSync(src, dest)
  }
}

function stashServerOnlyPaths() {
  rimraf(backupDir)
  fs.mkdirSync(backupDir, { recursive: true })
  for (const rel of moveAside) {
    const src = path.join(root, rel)
    if (!fs.existsSync(src)) continue
    const dest = path.join(backupDir, rel.replace(/\//g, path.sep))
    movePath(src, dest)
  }
}

function restoreServerOnlyPaths() {
  if (!fs.existsSync(backupDir)) return
  for (const rel of moveAside) {
    const from = path.join(backupDir, rel.replace(/\//g, path.sep))
    const to = path.join(root, rel)
    if (!fs.existsSync(from)) continue
    rimraf(to)
    movePath(from, to)
  }
  rimraf(backupDir)
}

console.log('Building static site for InfinityFree (PHP + MySQL API)...')

stashServerOnlyPaths()
try {
  run('npm', ['run', 'build'], {
    BUILD_STATIC: '1',
    NEXT_PUBLIC_API_EXT: '.php',
  })
} finally {
  restoreServerOnlyPaths()
}

if (!fs.existsSync(outDir)) {
  throw new Error('Next export did not produce an out/ directory.')
}

rimraf(distDir)
fs.mkdirSync(distDir, { recursive: true })
copyDir(outDir, distDir)
copyDir(path.join(root, 'deploy', 'api'), path.join(distDir, 'api'))
fs.copyFileSync(path.join(root, 'deploy', '.htaccess'), path.join(distDir, '.htaccess'))
fs.copyFileSync(path.join(root, 'deploy', 'schema.sql'), path.join(distDir, 'schema.sql'))

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, ADMIN_ACCESS_KEY } = process.env
const remoteDb =
  DB_HOST &&
  DB_USER &&
  DB_NAME &&
  !/^127\.0\.0\.1$/i.test(DB_HOST) &&
  !/^localhost$/i.test(DB_HOST)

if (remoteDb) {
  const php = `<?php
declare(strict_types=1);

return [
    'db_host' => ${JSON.stringify(DB_HOST)},
    'db_user' => ${JSON.stringify(DB_USER)},
    'db_pass' => ${JSON.stringify(DB_PASSWORD ?? '')},
    'db_name' => ${JSON.stringify(DB_NAME)},
    'admin_key' => ${JSON.stringify(ADMIN_ACCESS_KEY ?? '1111')},
];
`
  fs.writeFileSync(path.join(distDir, 'api', 'config.local.php'), php, 'utf8')
  console.log('Wrote api/config.local.php from .env.local MySQL settings.')
}

console.log('')
console.log(`Deployment package ready: ${distDir}`)
console.log('Upload everything inside dist/site/ to your InfinityFree htdocs root.')
console.log('Then copy deploy/api/config.local.php.example → api/config.local.php with MySQL credentials.')
console.log('Import schema.sql in phpMyAdmin or run: npm run db:init against remote MySQL.')

const upload = spawnSync(
  process.execPath,
  [path.join(root, 'scripts', 'upload-deploy.mjs')],
  { cwd: root, stdio: 'inherit', shell: false },
)
if (upload.status !== 0 && upload.status !== null) {
  process.exit(upload.status)
}
