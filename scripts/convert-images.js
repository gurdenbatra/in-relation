import sharp from 'sharp'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import { execFile } from 'child_process'
import { promisify } from 'util'

const require = createRequire(import.meta.url)
const execFileAsync = promisify(execFile)

/** Prefer bundled ffmpeg (Netlify/Linux has no system ffmpeg). */
function resolveFfmpegBinary() {
  try {
    const bundled = require('ffmpeg-static')
    if (typeof bundled === 'string' && bundled && fs.existsSync(bundled)) return bundled
  } catch {
    /* optional at install time */
  }
  return 'ffmpeg'
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.join(__dirname, '..', 'images')
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images')

/** Max edge for photos; keeps quality on retina without shipping full 12MP files. */
const MAX_DIMENSION = 2400
const WEBP_QUALITY = 82

const RASTER_EXT = new Set(['.heic', '.jpg', '.jpeg', '.png'])

/**
 * Re-run when source is newer, or when output looks like a stale tiny placeholder
 * (mtime can be wrong after git checkouts).
 */
export function shouldConvert(srcPath, outPath, outExists, srcMtime, outMtime, srcSize, outSize) {
  if (!outExists) return true
  if (srcMtime > outMtime) return true
  if (srcSize > 400_000 && outSize > 0 && outSize < 80_000) return true
  return false
}

export function getOutputPath(filename, outputDir) {
  const ext = path.extname(filename).toLowerCase()
  const safeBase = path
    .basename(filename, path.extname(filename))
    .replace(/ /g, '-')
    .normalize('NFC')
  if (RASTER_EXT.has(ext)) {
    return path.join(outputDir, `${safeBase}.webp`)
  }
  return path.join(outputDir, safeBase + ext)
}

async function sharpToWebp(srcPath, outPath) {
  await sharp(srcPath)
    .rotate()
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(outPath)
}

/** ffmpeg often decodes iPhone HEIC to broken tiny frames; use only as last resort. */
async function ffmpegHeicToWebp(srcPath, outPath) {
  await execFileAsync(resolveFfmpegBinary(), [
    '-hide_banner',
    '-loglevel',
    'error',
    '-i',
    srcPath,
    '-vf',
    `scale=${MAX_DIMENSION}:${MAX_DIMENSION}:force_original_aspect_ratio=decrease`,
    '-c:v',
    'libwebp',
    '-quality',
    String(WEBP_QUALITY),
    '-y',
    outPath,
  ])
}

/** macOS decodes HEIC reliably; then sharp resizes/compresses to WebP. */
async function sipsHeicToPngThenWebp(srcPath, outPath) {
  const tmpPng = path.join(
    os.tmpdir(),
    `in-relation-heic-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}.png`,
  )
  try {
    await execFileAsync('sips', ['-s', 'format', 'png', '--out', tmpPng, srcPath])
    await sharpToWebp(tmpPng, outPath)
  } finally {
    if (fs.existsSync(tmpPng)) fs.unlinkSync(tmpPng)
  }
}

function removeLegacyRastersInPublic(safeBase) {
  for (const legacyExt of ['.jpg', '.jpeg', '.png', '.HEIC', '.heic']) {
    const legacyPath = path.join(OUTPUT_DIR, safeBase + legacyExt)
    if (fs.existsSync(legacyPath)) {
      fs.unlinkSync(legacyPath)
    }
  }
}

export async function convertRasterToWebp(srcPath, outPath, ext) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  if (ext === '.heic' && process.platform === 'darwin') {
    await sipsHeicToPngThenWebp(srcPath, outPath)
    return
  }
  try {
    await sharpToWebp(srcPath, outPath)
  } catch (err) {
    if (ext === '.heic') {
      console.warn(`  sharp failed for HEIC (${err.message}), trying ffmpeg…`)
      await ffmpegHeicToWebp(srcPath, outPath)
    } else {
      throw err
    }
  }
}

async function run() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`Source folder missing: ${IMAGES_DIR}`)
    process.exit(1)
  }
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = fs.readdirSync(IMAGES_DIR)

  for (const filename of files) {
    const srcPath = path.join(IMAGES_DIR, filename)
    const ext = path.extname(filename).toLowerCase()

    if (!RASTER_EXT.has(ext)) continue

    const outPath = getOutputPath(filename, OUTPUT_DIR)
    const safeBase = path
      .basename(filename, path.extname(filename))
      .replace(/ /g, '-')
      .normalize('NFC')
    const srcStat = fs.statSync(srcPath)
    const outExists = fs.existsSync(outPath)
    const outStat = outExists ? fs.statSync(outPath) : null

    if (
      !shouldConvert(
        srcPath,
        outPath,
        outExists,
        srcStat.mtime,
        outStat?.mtime ?? null,
        srcStat.size,
        outStat?.size ?? 0,
      )
    ) {
      console.log(`  skip  ${filename} (up to date)`)
      continue
    }

    console.log(`  webp  ${filename}`)
    await convertRasterToWebp(srcPath, outPath, ext)
    removeLegacyRastersInPublic(safeBase)
  }

  console.log('Image conversion complete.')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
