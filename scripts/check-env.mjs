import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const minimumNode = readFileSync(new URL('../.nvmrc', import.meta.url), 'utf8').trim()
const minimumNpm = pkg.packageManager.replace('npm@', '')
const npmVersion = process.env.npm_config_user_agent?.match(/^npm\/([\d.]+)/)?.[1]

function supported(actual, minimum) {
  if (!actual) return false
  const parts = actual.split('.').map(Number)
  const required = minimum.split('.').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN) || parts[0] !== required[0]) return false
  for (let index = 1; index < 3; index += 1) {
    if (parts[index] !== required[index]) return parts[index] > required[index]
  }
  return true
}

if (!supported(process.versions.node, minimumNode) || !supported(npmVersion, minimumNpm)) {
  console.error(`Use Node ${pkg.engines.node} and npm ${pkg.engines.npm}. Run nvm use, then npm run check:env.`)
  console.error(`Detected Node ${process.versions.node}, npm ${npmVersion || 'unknown (run through npm)'}.`)
  process.exitCode = 1
} else {
  console.log(`Environment OK: Node ${process.versions.node}, npm ${npmVersion}`)
}
