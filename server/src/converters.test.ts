import { describe, it, expect } from 'vitest'
import { intToRoman, romanToInt } from '../client/src/converters'

describe('converters', () => {
  it('intToRoman - basic values', () => {
    expect(intToRoman(1)).toBe('I')
    expect(intToRoman(4)).toBe('IV')
    expect(intToRoman(9)).toBe('IX')
    expect(intToRoman(1999)).toBe('MCMXCIX')
  })

  it('intToRoman - invalid inputs', () => {
    expect(() => intToRoman(0)).toThrow()
    expect(() => intToRoman(4000)).toThrow()
    expect(() => intToRoman(-5)).toThrow()
  })

  it('romanToInt - basic and canonical', () => {
    expect(romanToInt('I')).toBe(1)
    expect(romanToInt('iv')).toBe(4)
    expect(romanToInt(' MCMXCIX ')).toBe(1999)
  })

  it('romanToInt - invalid or non-canonical', () => {
    expect(() => romanToInt('IIII')).toThrow()
    expect(() => romanToInt('ABC')).toThrow()
  })
})