// server/api/a2r.ts
// /api/a2r.js
// Acepta GET ?roman=XXIV  o ?r=XXIV  o POST { "roman":"XXIV" } / { "r":"XXIV" }

// api/a2r.ts
// Román → entero
// api/a2r.ts
// Román → entero (TypeScript, export default para Vercel)

// Convierte una cadena romana válida a entero. Devuelve null si la cadena es inválida.
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
    if (cur === undefined) return null; // caracter inválido
    if (next !== undefined && cur < next) total -= cur;
    else total += cur;
  }
  return total;
}

// Handler principal (Vercel / serverless). Tipado con any para req/res por simplicidad.
export default function handler(req: any, res: any): void {
  // CORS simple para usar desde /public/index.html
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let roman: string | null = null;

  if (req.method === 'GET') {
    // Soportamos ?roman=XXIV  o ?r=XXIV  o ?q=XXIV
    const q = req.query || {};
    roman = (q.roman || q.r || q.q) ?? null;
  } else {
    // Intentamos parsear JSON body si viene como string
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      roman = body.roman || body.r || body.q || null;
    } catch {
      roman = null;
    }
  }

  if (!roman || String(roman).trim() === '') {
    res.status(400).json({ error: "Parámetro inválido: se esperaba 'roman' (ej: ?roman=XXIV o { roman: 'XXIV' })" });
    return;
  }

  const value = romanToInt(String(roman));
  if (value === null) {
    res.status(400).json({ error: 'Número romano inválido' });
    return;
  }

  res.status(200).json({ roman: String(roman).toUpperCase(), value });
}
