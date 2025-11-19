// server/api/r2a.tsimport { VercelRequest, VercelResponse } from "@vercel/node";
// /api/r2a.js
// Acepta GET ?number=24  o ?n=24  o POST { "number":24 } / { "n":24 }

// api/r2a.ts
// Entero → Romano
function intToRoman(origNum: number | string): string | null {
  let num = Number(origNum);
  if (!Number.isInteger(num) || num <= 0 || num >= 4000) return null;
  const vals: [number,string][] = [
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

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  let numberParam: any = null;
  if (req.method === 'GET') {
    numberParam = req.query && (req.query.number || req.query.n || req.query.q);
  } else {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      numberParam = body.number || body.n || body.q;
    } catch {
      numberParam = null;
    }
  }

  if (numberParam == null || String(numberParam).trim() === '') {
    return res.status(400).json({ error: "Parámetro inválido: se esperaba 'number' (ej: ?number=24 o { number: 24 })" });
  }

  const roman = intToRoman(numberParam);
  if (roman === null) return res.status(400).json({ error: 'Número inválido. Debe ser entero entre 1 y 3999' });

  return res.status(200).json({ number: Number(numberParam), roman });
}
