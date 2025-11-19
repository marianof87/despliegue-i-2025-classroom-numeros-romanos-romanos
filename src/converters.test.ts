import { describe, it, expect } from 'vitest'
import { intToRoman, romanToInt } from './converters'

describe('intToRoman', () => {
  it('convierte correctamente números válidos', () => {
    expect(intToRoman(1)).toBe('I')
    expect(intToRoman(4)).toBe('IV')
    expect(intToRoman(9)).toBe('IX')
    expect(intToRoman(40)).toBe('XL')
    expect(intToRoman(90)).toBe('XC')
    expect(intToRoman(400)).toBe('CD')
    expect(intToRoman(900)).toBe('CM')
    expect(intToRoman(3999)).toBe('MMMCMXCIX')
  })

  it('lanza error si el número no es entero', () => {
    expect(() => intToRoman(3.5)).toThrow('El número debe ser entero')
  })

  it('lanza error si el número está fuera del rango 1-3999', () => {
    expect(() => intToRoman(0)).toThrow('Número fuera de rango (1-3999)')
    expect(() => intToRoman(4000)).toThrow('Número fuera de rango (1-3999)')
    expect(() => intToRoman(-5)).toThrow('Número fuera de rango (1-3999)')
  })
})

describe('romanToInt', () => {
  it('convierte números romanos válidos a enteros', () => {
    expect(romanToInt('I')).toBe(1)
    expect(romanToInt('IV')).toBe(4)
    expect(romanToInt('IX')).toBe(9)
    expect(romanToInt('XL')).toBe(40)
    expect(romanToInt('XC')).toBe(90)
    expect(romanToInt('CD')).toBe(400)
    expect(romanToInt('CM')).toBe(900)
    expect(romanToInt('MMMCMXCIX')).toBe(3999)
  })

  it('ignora espacios y mayúsculas/minúsculas mezcladas', () => {
    expect(romanToInt('  ix  ')).toBe(9)
    expect(romanToInt('mMmCmXcIx')).toBe(3999)
  })

  it('convierte combinaciones complejas correctamente', () => {
    expect(romanToInt('XLII')).toBe(42)
    expect(romanToInt('XCIX')).toBe(99)
    expect(romanToInt('CDXLIV')).toBe(444)
  })

  it('lanza error si la cadena es inválida o vacía', () => {
    expect(() => romanToInt('')).toThrow('Cadena inválida')
    expect(() => romanToInt(null as unknown as string)).toThrow('Cadena inválida')
    expect(() => romanToInt(undefined as unknown as string)).toThrow('Cadena inválida')
  })

  it('lanza error si contiene caracteres no romanos', () => {
    expect(() => romanToInt('ABCD')).toThrow('Caracteres inválidos en romano')
    expect(() => romanToInt('XIV!')).toThrow('Caracteres inválidos en romano')
  })

  it('lanza error si el número romano no está en forma canónica', () => {
    expect(() => romanToInt('IIII')).toThrow('Número romano no canónico')
    expect(() => romanToInt('VV')).toThrow('Número romano no canónico')
    expect(() => romanToInt('IL')).toThrow('Número romano no canónico')
    expect(() => romanToInt('XD')).toThrow('Número romano no canónico')
    expect(() => romanToInt('MMMM')).toThrow('Número fuera de rango (1-3999)')
  })
})