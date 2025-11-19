// api/a2r.js (robusto)
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

function extractFirst(v) {
  if (v == null) return null;
  if (Array.isArray(v)) return v.length ? v[0] : null;
  return v;
}

function parseNumberFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  // Buscar ?number=123 / &number=123
  const mQuery = url.match(/[?&](?:number|n|num|value|q)=([^&]+)/i);
  if (mQuery && mQuery[1]) return decodeURIComponent(mQuery[1]);
  // Buscar /a2r/123 o /a2r/number/123
  const mPath = url.match(/\/a2r(?:\/(?:number|n|num)\/)?\/?([0-9]{1,4})/i);
  if (mPath && mPath[1]) return mPath[1];
  return null;
}

module.exports = (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Intentamos resolver el parámetro number desde muchas fuentes
  let numberParam = null;
  const q = req.query || {};

  // posibles claves
  const candidates = ['number','n','num','value','q'];

  for (const k of candidates) {
    if (q[k] !== undefined) {
      numberParam = extractFirst(q[k]);
      break;
    }
  }

  // si no lo encontramos en query, intentar en body (POST)
  if ((numberParam === null || numberParam === undefined) && req.body) {
    try {
      const body = (typeof req.body === 'string') ? JSON.parse(req.body) : req.body;
      for (const k of candidates) {
        if (body && body[k] !== undefined) {
          numberParam = extractFirst(body[k]);
          break;
        }
      }
    } catch (e) {
      // ignore parse error
    }
  }

  // si sigue sin encontrarse, intentar extraer del url raw (por si viene sin clave)
  if (numberParam === null || numberParam === undefined) {
    const fromUrl = parseNumberFromUrl(req.url || req.originalUrl || '');
    if (fromUrl) numberParam = fromUrl;
  }

  // normalizar
  if (numberParam != null) numberParam = String(numberParam).trim();

  if (numberParam == null || numberParam === '') {
    return res.status(400).json({ error: "Parámetro inválido: se esperaba 'number' (ej: ?number=7)" });
  }

  // Aceptar si vienen floats como "7.0" — convertir a entero si corresponde
  const parsed = Number(numberParam);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    return res.status(400).json({ error: 'Número inválido. Debe ser entero entre 1 y 3999' });
  }

  const roman = intToRoman(parsed);
  if (roman === null) {
    return res.status(400).json({ error: 'Número inválido. Debe ser entero entre 1 y 3999' });
  }

  return res.status(200).json({ roman });
};
