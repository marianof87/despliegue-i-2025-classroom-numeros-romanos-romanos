// server/api/a2r.ts
// /api/a2r.js
// Acepta GET ?roman=XXIV  o ?r=XXIV  o POST { "roman":"XXIV" } / { "r":"XXIV" }

// api/a2r.ts
// Román → entero
// api/a2r.ts
// Román → entero (TypeScript, export default para Vercel)

// Convierte una cadena romana válida a entero. Devuelve null si la cadena es inválida.
// /api/a2r.js
// Convierte arábigo -> romano. Responde 200 con { number, roman } o 400 con { error }.
// api/a2r.ts
// ARÁBIGO -> ROMANO
// api/a2r.js
// ARÁBIGO -> ROMANO (GET ?number=7)

// api/a2r.ts
// ARÁBIGO -> ROMANO (TypeScript)
// api/a2r.ts
// ARÁBIGO -> ROMANO (no depende de @vercel/node ni de utils externos)

function intToRoman(origNum: number | string): string | null {
  let num: number = Number(origNum);
  if (!Number.isInteger(num) || num <= 0 || num >= 4000) return null;
  const vals: [number, string][] = [
    [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
    [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
    [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
  ];
  let res = '';
  for (const [v, r] of vals) {
    while (num >= v) {
      res += r;
      num -= v;
    }
  }
  return res;
}

export default function handler(req: any, res: any): void {
  // CORS simple
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const q: any = req.query || {};
  const numberParam: any = (q.number ?? q.n ?? q.q) ?? null;

  if (numberParam == null || String(numberParam).trim() === '') {
    res.status(400).json({ error: "Parámetro inválido: se esperaba 'number' (ej: ?number=7)" });
    return;
  }

  const roman = intToRoman(numberParam);
  if (roman === null) {
    res.status(400).json({ error: 'Número inválido. Debe ser entero entre 1 y 3999' });
    return;
  }

  res.status(200).json({ number: Number(numberParam), roman });
}

