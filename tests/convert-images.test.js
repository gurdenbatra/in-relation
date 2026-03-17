import { describe, it, expect } from 'vitest'
import { shouldConvert, getOutputPath } from '../scripts/convert-images.js'

describe('shouldConvert', () => {
  it('returns true when output does not exist', () => {
    expect(shouldConvert('/src/img.HEIC', '/out/img.webp', false, null, null)).toBe(true)
  })

  it('returns false when output exists and output mtime >= source mtime', () => {
    const srcMtime = new Date('2025-01-01')
    const outMtime = new Date('2025-01-02')
    expect(shouldConvert('/src/img.HEIC', '/out/img.webp', true, srcMtime, outMtime)).toBe(false)
  })

  it('returns true when output exists but source is newer', () => {
    const srcMtime = new Date('2025-01-03')
    const outMtime = new Date('2025-01-01')
    expect(shouldConvert('/src/img.HEIC', '/out/img.webp', true, srcMtime, outMtime)).toBe(true)
  })
})

describe('getOutputPath', () => {
  it('converts HEIC extension to webp', () => {
    const result = getOutputPath('1Reuterkiez1.HEIC', '/public/images')
    expect(result).toBe('/public/images/1Reuterkiez1.webp')
  })

  it('converts heic (lowercase) extension to webp', () => {
    const result = getOutputPath('photo.heic', '/public/images')
    expect(result).toBe('/public/images/photo.webp')
  })

  it('keeps jpg extension as-is', () => {
    const result = getOutputPath('3Hasenheide4.jpg', '/public/images')
    expect(result).toBe('/public/images/3Hasenheide4.jpg')
  })

  it('replaces spaces with hyphens in HEIC output name', () => {
    const result = getOutputPath('7Treptower Park5.HEIC', '/public/images')
    expect(result).toBe('/public/images/7Treptower-Park5.webp')
  })

  it('replaces spaces with hyphens in jpg output name', () => {
    const result = getOutputPath('5Frankfurter Allee1.jpg', '/public/images')
    expect(result).toBe('/public/images/5Frankfurter-Allee1.jpg')
  })
})
