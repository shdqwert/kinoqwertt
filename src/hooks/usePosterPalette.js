import { useEffect, useState } from 'react'

const SAMPLE_W = 48
const SAMPLE_H = 72
const BUCKET_STEP = 24
const PALETTE_SIZE = 4
const cache = new Map()

function toHex(r, g, b) {
  return `#${[r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`
}

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h, s, l }
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const v = l * 255
    return [v, v, v]
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hue2rgb = (t) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }
  return [hue2rgb(h + 1 / 3) * 255, hue2rgb(h) * 255, hue2rgb(h - 1 / 3) * 255]
}

// A raw extracted swatch can be near-white (a snow/silver poster) or
// near-black (a poster shot at night) — pasted straight into a background
// that still needs to hold readable text, either one breaks contrast. This
// keeps the swatch's actual hue (so a cold poster still reads cold, a warm
// one still reads warm) while pulling its lightness into a band that always
// reads as a deep, cinematic backdrop rather than a flat wash of one shade.
function toAtmosphericColor(hex) {
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  if (s < 0.04) {
    // Genuinely achromatic (true grayscale poster) — stay neutral instead of
    // inventing a hue that isn't actually in the artwork.
    const [nr, ng, nb] = hslToRgb(0, 0, Math.min(0.34, Math.max(0.1, l * 0.55)))
    return toHex(nr, ng, nb)
  }
  const [nr, ng, nb] = hslToRgb(h, Math.max(s, 0.5), Math.min(0.4, Math.max(0.14, l)))
  return toHex(nr, ng, nb)
}

// Genuine color quantization of the poster's own pixels: bucket every pixel
// into a coarse RGB grid, score each bucket by how much of the poster it
// covers *and* how vivid it is, then greedily keep the buckets that are both
// significant and visually distinct from one another. This is what makes
// the result depend entirely on the specific poster instead of any preset
// palette — a different poster always quantizes to different buckets.
function extractPalette(image) {
  const canvas = document.createElement('canvas')
  canvas.width = SAMPLE_W
  canvas.height = SAMPLE_H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(image, 0, 0, SAMPLE_W, SAMPLE_H)
  const { data } = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H)

  const buckets = new Map()
  let lightnessSum = 0
  let pixelCount = 0

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3]
    if (alpha < 200) continue
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const { l } = rgbToHsl(r, g, b)
    lightnessSum += l
    pixelCount++

    const key = `${Math.round(r / BUCKET_STEP)},${Math.round(g / BUCKET_STEP)},${Math.round(b / BUCKET_STEP)}`
    const bucket = buckets.get(key) || { r: 0, g: 0, b: 0, count: 0 }
    bucket.r += r
    bucket.g += g
    bucket.b += b
    bucket.count += 1
    buckets.set(key, bucket)
  }

  if (!pixelCount) return { colors: ['#1a1a1a', '#0d0d0d'], isDark: true }

  const overallLightness = lightnessSum / pixelCount

  const candidates = [...buckets.values()].map((bucket) => {
    const r = bucket.r / bucket.count
    const g = bucket.g / bucket.count
    const b = bucket.b / bucket.count
    const { s, l } = rgbToHsl(r, g, b)
    const coverage = bucket.count / pixelCount
    // Vivid, mid-brightness colors read as "the poster's colors"; washed-out
    // near-white/near-black buckets are down-weighted but never zeroed, so a
    // genuinely monochrome or dark poster still yields a dark palette
    // instead of being forced toward color it doesn't have.
    const vividness = 0.25 + s * (1 - Math.abs(l - 0.5)) * 0.9
    return { r, g, b, coverage, vividness, score: coverage ** 0.75 * vividness }
  })

  candidates.sort((a, b) => b.score - a.score)

  const picked = []
  for (const c of candidates) {
    if (picked.length >= PALETTE_SIZE) break
    const tooClose = picked.some((p) => {
      const dr = p.r - c.r
      const dg = p.g - c.g
      const db = p.b - c.b
      return Math.sqrt(dr * dr + dg * dg + db * db) < 40
    })
    if (!tooClose) picked.push(c)
  }

  // A near-monochrome poster can legitimately quantize to just one or two
  // distinct buckets — fill out the rest of the palette with lighter/darker
  // variants of what's actually there rather than inventing new hues.
  while (picked.length < PALETTE_SIZE && picked.length > 0) {
    const base = picked[picked.length % picked.length]
    const { h, s, l } = rgbToHsl(base.r, base.g, base.b)
    const shift = picked.length % 2 === 0 ? 0.12 : -0.12
    const [r, g, b] = hslToRgb(h, s, Math.min(0.92, Math.max(0.08, l + shift)))
    picked.push({ r, g, b, coverage: 0, vividness: 0, score: 0 })
  }

  return {
    colors: picked.map((c) => toAtmosphericColor(toHex(c.r, c.g, c.b))),
    isDark: overallLightness < 0.4,
  }
}

/**
 * Extracts a real color palette from a poster image via canvas pixel
 * quantization, so a movie's atmosphere is generated from its own artwork
 * instead of any preset/curated color. Cached by image URL.
 */
export function usePosterPalette(imageSrc) {
  // Cache hits are read straight from render (no state indirection needed);
  // `palette` only tracks the result of an in-flight async extraction.
  const [palette, setPalette] = useState(undefined)

  useEffect(() => {
    if (!imageSrc || cache.has(imageSrc)) return

    let cancelled = false
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      if (cancelled) return
      try {
        const result = extractPalette(image)
        cache.set(imageSrc, result)
        setPalette(result)
      } catch {
        setPalette(undefined)
      }
    }
    image.onerror = () => {
      if (!cancelled) setPalette(undefined)
    }
    image.src = imageSrc

    return () => {
      cancelled = true
    }
  }, [imageSrc])

  if (imageSrc && cache.has(imageSrc)) return cache.get(imageSrc)
  return palette
}

export default usePosterPalette
