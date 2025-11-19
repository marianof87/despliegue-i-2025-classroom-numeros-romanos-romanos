// api/r2a.js
// ROMANO -> ARÁBIGO

function romanToInt(s) {
  if (!s || typeof s !== 'string') return null;
  s = s.toUpperCase().trim();
  const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]];
    const next = map[s[i+1]];
    if (cur == null) return null;
    if (next && cur < next) total -= cur;
    else total += cur;
  }
  return total;
}

module.exports = (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Only GET expected for evaluator, but also accept POST bodies
  let roman = null;
  if (req.method === 'GET') {
    const q = req.query || {};
    roman = (q.roman || q.r || q.q) ?? null;
  } else {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      roman = body.roman || body.r || body.q || null;
    } catch (e) {
      roman = null;
    }
  }

  if (!roman || String(roman).trim() === '') {
    return res.status(400).json({ error: "Parámetro inválido: se esperaba 'roman' (ej: ?roman=I)" });
  }

  const value = romanToInt(String(roman));
  if (value === null) return res.status(400).json({ error: 'Número romano inválido' });

  return res.status(200).json({ roman: String(roman).toUpperCase(), value });
};
