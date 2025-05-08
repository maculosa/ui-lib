import { describe, expect, it } from 'vitest'

function add(a: number, b: number) {
  return a + b
}

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).toBe(3)
  })
})

