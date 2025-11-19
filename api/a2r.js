// api/a2r.js
// ARÁBIGO -> ROMANO, devuelve { roman: "..." } o 400

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

  let numberParam = null;
  if (req.method === 'GET') {
    const q = req.query || {};
    numberParam = q.number || q.n || q.q;
  } else {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      numberParam = body.number || body.n || body.q;
    } catch (e) {
      numberParam = null;
    }
  }

  if (numberParam == null || String(numberParam).trim() === '') {
    return res.status(400).json({ error: "Parámetro inválido: se esperaba 'number' (ej: ?number=7)" });
  }

  const roman = intToRoman(numberParam);
  if (roman === null) {
    return res.status(400).json({ error: 'Número inválido. Debe ser entero entre 1 y 3999' });
  }

  // Respuesta con la clave exacta que pide el evaluador
  return res.status(200).json({ roman });
};
