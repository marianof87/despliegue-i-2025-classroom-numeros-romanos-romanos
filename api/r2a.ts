// server/api/r2a.tsimport { VercelRequest, VercelResponse } from "@vercel/node";
// /api/r2a.js
// Acepta GET ?number=24  o ?n=24  o POST { "number":24 } / { "n":24 }

// api/r2a.ts
// Entero → Romano
// /api/r2a.js
// Convierte romano -> arábigo. Responde 200 con { roman, value } o 400 con { error }.
// api/r2a.ts
// ROMANO -> ARÁBIGO

function romanToInt(s: string): number | null {
  if (!s || typeof s !== 'string') return null;
  s = s.toUpperCase().trim();
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const curCh = s[i];
    const nextCh = s[i + 1];
    const cur = map[curCh];
    const next = nextCh ? map[nextCh] : undefined;
    if (cur === undefined) return null;
    if (next !== undefined && cur < next) total -= cur;
    else total += cur;
  }
  return total;
}

export default function handler(req: any, res: any): void {
  // CORS básico
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let roman: string | null = null;
  if (req.method === 'GET') {
    const q = req.query || {};
    roman = (q.roman || q.r || q.q) ?? null;
  } else {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      roman = body.roman || body.r || body.q || null;
    } catch {
      roman = null;
    }
  }

  if (!roman || String(roman).trim() === '') {
    res.status(400).json({ error: "Parámetro inválido: se esperaba 'roman' (ej: ?roman=I)" });
    return;
  }

  const value = romanToInt(String(roman));
  if (value === null) {
    res.status(400).json({ error: 'Número romano inválido' });
    return;
  }

  res.status(200).json({ roman: String(roman).toUpperCase(), value });
}
