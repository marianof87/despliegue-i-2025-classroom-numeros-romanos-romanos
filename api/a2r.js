// api/a2r.js (robusto v2)
// ARÁBIGO -> ROMANO, devuelve { roman: "..." } o 400

function intToRoman(numInput) {
  const num = Number(numInput);
  if (!Number.isInteger(num) || num <= 0 || num >= 4000) return null;
  const vals = [
    [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
    [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
    [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
  ];
  let n = num;
  let res = '';
  for (const [v, r] of vals) {
    while (n >= v) { res += r; n -= v; }
  }
  return res;
}

function extractFirst(v) {
  if (v == null) return null;
  if (Array.isArray(v)) return v.length ? v[0] : null;
  return v;
}

function findNumberInString(s) {
  if (!s || typeof s !== 'string') return null;
  // Busca el primer bloque de dígitos (acepta espacios, %20, etc.)
  const decoded = decodeURIComponent(s);
  const m = decoded.match(/-?\d+/);
  return m ? m[0] : null;
}

function parseNumberFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  // chequeos simples: ?number=123 etc
  const mQuery = url.match(/[?&](?:number|n|num|value|q)=([^&]+)/i);
  if (mQuery && mQuery[1]) {
    const found = findNumberInString(mQuery[1]);
    if (found) return found;
  }
  // ?123 or &123 (query sin clave) -> buscar tokens numéricos en entire querystring
  const qPart = url.split('?')[1] || '';
  const tokenMatch = qPart.match(/(^|&)(\d{1,4})($|&)/);
  if (tokenMatch && tokenMatch[2]) return tokenMatch[2];
  // path: /a2r/123 or /a2r/number/123
  const mPath = url.match(/\/a2r(?:\/(?:number|n|num)\/)?\/?(-?\d{1,4})/i);
  if (mPath && mPath[1]) return mPath[1];
  return null;
}

function findNumberInQueryObject(q) {
  if (!q || typeof q !== 'object') return null;
  // 1) look for common keys
  const keysCommon = ['number','n','num','value','q'];
  for (const k of keysCommon) {
    if (q[k] !== undefined) {
      const v = extractFirst(q[k]);
      const found = findNumberInString(String(v));
      if (found) return found;
    }
  }
  // 2) look for any value that contains digits
  for (const k of Object.keys(q)) {
    const v = q[k];
    // if key itself is numeric (e.g. ?275=)
    if (/^\d+$/.test(k)) return k;
    const candidate = extractFirst(v);
    const found = findNumberInString(String(candidate));
    if (found) return found;
  }
  return null;
}

module.exports = (req, res) => {
  // CORS básico
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 1) intentar desde query object
  let numberParam = findNumberInQueryObject(req.query || {});

  // 2) intentar desde body (POST)
  if ((numberParam === null || numberParam === undefined) && req.body) {
    try {
      const body = (typeof req.body === 'string') ? JSON.parse(req.body) : req.body;
      const n = findNumberInQueryObject(body);
      if (n) numberParam = n;
      else {
        // si body es una cadena con números, capturarlos
        const s = (typeof body === 'string') ? body : JSON.stringify(body);
        const found = findNumberInString(s);
        if (found) numberParam = found;
      }
    } catch (e) {
      // ignore parse error
      const s = (typeof req.body === 'string') ? req.body : JSON.stringify(req.body);
      const found = findNumberInString(s);
      if (found) numberParam = found;
    }
  }

  // 3) intentar extraer del url raw (por si viene sin clave)
  if (numberParam === null || numberParam === undefined) {
    const fromUrl = parseNumberFromUrl(req.url || req.originalUrl || '');
    if (fromUrl) numberParam = fromUrl;
  }

  if (numberParam != null) numberParam = String(numberParam).trim();

  if (numberParam == null || numberParam === '') {
    return res.status(400).json({ error: "Parámetro inválido: se esperaba 'number' (ej: ?number=7)" });
  }

  // normalizar y validar entero
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
