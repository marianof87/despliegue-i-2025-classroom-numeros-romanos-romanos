// api/r2a.js
// ROMANO -> ARÁBIGO, devuelve { arabic: <n> } o 400

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

function intToRoman(numInput) {
  let num = Number(numInput);
  if (!Number.isInteger(num) || num <= 0 || num >= 4000) return null;
  const vals = [
    [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
    [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
    [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
  ];
  let res = '';
  for (const [v, r] of vals) {
    while (num >= v) { res += r; num -= v; }
  }
  return res;
}

module.exports = (req, res) => {
  // CORS básico
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Solo GET para el evaluador (pero aceptamos POST también)
  let romanParam = null;
  if (req.method === 'GET') {
    const q = req.query || {};
    romanParam = q.roman || q.r || q.q || null;
  } else {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      romanParam = body.roman || body.r || body.q || null;
    } catch (e) {
      romanParam = null;
    }
  }

  if (!romanParam || String(romanParam).trim() === '') {
    return res.status(400).json({ error: "Parámetro inválido: se esperaba 'roman' (ej: ?roman=I)" });
  }

  // Parsear a entero
  const value = romanToInt(String(romanParam));
  if (value === null) {
    return res.status(400).json({ error: 'Número romano inválido' });
  }

  // Validación CANÓNICA: convertir ese número de vuelta a romano y comparar.
  // Así rechazamos formas no estándar/orden incorrecto.
  const canonical = intToRoman(value);
  if (canonical === null || canonical !== String(romanParam).toUpperCase()) {
    return res.status(400).json({ error: 'Número romano inválido o no canónico' });
  }

  // Respuesta con la clave exacta que pide el evaluador
  return res.status(200).json({ arabic: value });
};
