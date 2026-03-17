import { describe, it, expect } from 'vitest'
import { walks, nextWalks } from '../src/data/walks.js'

const REQUIRED_WALK_FIELDS = ['id', 'name', 'location', 'question', 'images', 'hasPlaceholder', 'journalText', 'threeObjectType']

describe('walks data', () => {
  it('has exactly 12 walks', () => {
    expect(walks).toHaveLength(12)
  })

  it('each walk has all required fields', () => {
    walks.forEach((walk) => {
      REQUIRED_WALK_FIELDS.forEach((field) => {
        expect(walk, `walk ${walk?.id} missing field: ${field}`).toHaveProperty(field)
      })
    })
  })

  it('walk ids are 1-12 in order', () => {
    walks.forEach((walk, i) => {
      expect(walk.id).toBe(i + 1)
    })
  })

  it('each walk has at least one image or hasPlaceholder is true', () => {
    walks.forEach((walk) => {
      const valid = walk.hasPlaceholder || walk.images.length > 0
      expect(valid, `walk ${walk.id} has no images and hasPlaceholder is false`).toBe(true)
    })
  })

  it('threeObjectType is a known value', () => {
    const validTypes = ['leaf', 'cobblestone', 'pigeon', 'bottle', 'sign', 'bench']
    walks.forEach((walk) => {
      expect(validTypes, `walk ${walk.id} has unknown threeObjectType: ${walk.threeObjectType}`).toContain(walk.threeObjectType)
    })
  })
})

describe('nextWalks data', () => {
  it('has at least one upcoming walk', () => {
    expect(nextWalks.length).toBeGreaterThanOrEqual(1)
  })

  it('each next walk has id, location, date, teaser', () => {
    nextWalks.forEach((walk) => {
      expect(walk).toHaveProperty('id')
      expect(walk).toHaveProperty('location')
      expect(walk).toHaveProperty('date')
      expect(walk).toHaveProperty('teaser')
    })
  })
})
