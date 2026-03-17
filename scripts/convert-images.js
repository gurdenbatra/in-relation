import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.join(__dirname, '..', 'images')
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images')

export function shouldConvert(srcPath, outPath, outExists, srcMtime, outMtime) {
  if (!outExists) return true
  return srcMtime > outMtime
}

export function getOutputPath(filename, outputDir) {
  const ext = path.extname(filename).toLowerCase()
  const safeBase = path.basename(filename, path.extname(filename)).replace(/ /g, '-')
  if (ext === '.heic') {
    return path.join(outputDir, safeBase + '.webp')
  }
  return path.join(outputDir, safeBase + ext)
}

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = fs.readdirSync(IMAGES_DIR)

  for (const filename of files) {
    const srcPath = path.join(IMAGES_DIR, filename)
    const ext = path.extname(filename).toLowerCase()

    if (!['.heic', '.jpg', '.jpeg', '.png'].includes(ext)) continue

    const outPath = getOutputPath(filename, OUTPUT_DIR)
    const srcStat = fs.statSync(srcPath)
    const outExists = fs.existsSync(outPath)
    const outStat = outExists ? fs.statSync(outPath) : null

    if (!shouldConvert(srcPath, outPath, outExists, srcStat.mtime, outStat?.mtime ?? null)) {
      console.log(`  skip  ${filename} (up to date)`)
      continue
    }

    if (ext === '.heic') {
      console.log(`  convert  ${filename} → webp`)
      await execFileAsync('ffmpeg', ['-i', srcPath, '-quality', '85', '-y', outPath])
    } else {
      console.log(`  copy  ${filename}`)
      fs.copyFileSync(srcPath, outPath)
    }
  }

  console.log('Image conversion complete.')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run().catch(console.error)
}
