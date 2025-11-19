export function intToRoman(num: number): string {
  if (!Number.isInteger(num)) throw new Error("El número debe ser entero");
  if (num <= 0 || num >= 4000) throw new Error("Número fuera de rango (1-3999)");

  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];

  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) {
      result += syms[i];
      num -= vals[i];
    }
  }
  return result;
}

export function romanToInt(raw: string): number {
  if (!raw || typeof raw !== 'string') throw new Error('Cadena inválida');

  const s = raw.toUpperCase().trim();

  // Validación de caracteres romanos
  if (!/^[IVXLCDM]+$/.test(s)) throw new Error('Caracteres inválidos en romano');

  const map: Record<string, number> = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let total = 0;

  for (let i = 0; i < s.length; i++) {
    const curr = map[s[i]];
    const next = i + 1 < s.length ? map[s[i + 1]] : 0;
    if (next > curr) {
      total += next - curr;
      i++;
    } else {
      total += curr;
    }
  }

  // Validación canónica: convertir de vuelta y comparar
  const canonical = intToRoman(total);
  if (canonical !== s) throw new Error('Número romano no canónico');

  // Chequeo de rango después de validar la forma canónica
  if (total <= 0 || total >= 4000) throw new Error('Número fuera de rango (1-3999)');

  return total;
}
export const arabicToRoman = intToRoman;
export const romanToArabic = romanToInt;
