export function intToRoman(num: number): string {
  if (!Number.isInteger(num)) throw new Error('El número debe ser entero');
  if (num <= 0 || num >= 4000) throw new Error('Número fuera de rango (1-3999)');
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let res = '';
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) {
      res += syms[i];
      num -= vals[i];
    }
  }
  return res;
}

export function romanToInt(raw: string): number {
  if (!raw || typeof raw !== 'string') throw new Error('Cadena inválida');
  const s = raw.toUpperCase().trim();
  if (!/^[IVXLCDM]+$/.test(s)) throw new Error('Caracteres inválidos en romano');
  const map: Record<string, number> = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const curr = map[s[i]];
    const next = i+1 < s.length ? map[s[i+1]] : 0;
    if (next > curr) {
      total += next - curr;
      i++;
    } else {
      total += curr;
    }
  }
  // validación canónica
  if (intToRoman(total) !== s) throw new Error('Número romano no canónico');
  return total;
}