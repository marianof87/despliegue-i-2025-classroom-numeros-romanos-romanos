// api/a2r.js (corrección: validar formato cuando viene en clave)
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
  const decoded = decodeURIComponent(s);
  const m = decoded.match(/-?\d+/);
  return m ? m[0] : null;
}

function parseNumberFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const mQuery = url.match(/[?&](?:number|n|num|value|q)=([^&]+)/i);
  if (mQuery && mQuery[1]) {
    const found = findNumberInString(mQuery[1]);
    if (found) return found;
  }
  const qPart = url.split('?')[1] || '';
  const tokenMatch = qPart.match(/(^|&)(\d{1,4})($|&)/);
  if (tokenMatch && tokenMatch[2]) return tokenMatch[2];
  const mPath = url.match(/\/a2r(?:\/(?:number|n|num)\/)?\/?(-?\d{1,4})/i);
  if (mPath && mPath[1]) return mPath[1];
  return null;
}

function findNumberInQueryObject(q) {
  if (!q || typeof q !== 'object') return null;
  const keysCommon = ['number','n','num','value','q'];
  for (const k of keysCommon) {
    if (q[k] !== undefined) {
      const v = extractFirst(q[k]);
      const found = findNumberInString(String(v));
      if (found) return found;
    }
  }
  for (const k of Object.keys(q)) {
    if (/^\d+$/.test(k)) return k;
    const v = q[k];
    const candidate = extractFirst(v);
    const found = findNumberInString(String(candidate));
    if (found) return found;
  }
  return null;
}

module.exports = (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Queremos recordar la fuente original cuando venga desde clave
  let numberParam = null;
  let sourceRaw = null; // si viene desde una clave (ej ?number=12abc) guardamos el raw para validarlo

  const q = req.query || {};
  const commonKeys = ['number','n','num','value','q'];

  // 1) Buscar en query por claves comunes y capturar sourceRaw si encontramos una clave
  for (const k of commonKeys) {
    if (q[k] !== undefined) {
      sourceRaw = extractFirst(q[k]);
      numberParam = findNumberInString(String(sourceRaw));
      break;
    }
  }

  // 2) Si no encontrado en claves comunes, intentar detectar cualquier número en query (incluye tokens sin clave)
  if (numberParam === null || numberParam === undefined) {
    const alt = findNumberInQueryObject(q);
    if (alt) numberParam = alt;
  }

  // 3) body (POST) - dar preferencia a claves en body y guardar sourceRaw si viene desde body clave
  if ((numberParam === null || numberParam === undefined) && req.body) {
    try {
      const body = (typeof req.body === 'string') ? JSON.parse(req.body) : req.body;
      for (const k of commonKeys) {
        if (body && body[k] !== undefined) {
          sourceRaw = extractFirst(body[k]);
          numberParam = findNumberInString(String(sourceRaw));
          break;
        }
      }
      if ((numberParam === null || numberParam === undefined)) {
        // fallback: buscar cualquier número en el body
        const s = (typeof body === 'string') ? body : JSON.stringify(body);
        const found = findNumberInString(s);
        if (found) numberParam = found;
      }
    } catch (e) {
      const s = (typeof req.body === 'string') ? req.body : JSON.stringify(req.body);
      const found = findNumberInString(s);
      if (found) numberParam = found;
    }
  }

  // 4) si sigue sin encontrarse, extraer del url raw (por si viene sin clave)
  if (numberParam === null || numberParam === undefined) {
    const fromUrl = parseNumberFromUrl(req.url || req.originalUrl || '');
    if (fromUrl) {
      numberParam = fromUrl;
      // desde URL sin clave -> no ponemos sourceRaw (aceptamos tokens numéricos)
      sourceRaw = sourceRaw || null;
    }
  }

  if (numberParam != null) numberParam = String(numberParam).trim();

  // --- NUEVA VALIDACIÓN CRÍTICA: si el valor vino desde una clave (sourceRaw != null)
  // exigimos que sourceRaw sea únicamente dígitos (con espacios permitidos). Ej: "12abc" -> rechazar.
  if (sourceRaw != null) {
    const s = String(sourceRaw).trim();
    if (!/^\d+$/.test(s)) {
      return res.status(400).json({ error: "Número inválido. Debe ser entero entre 1 y 3999" });
    }
  }

  if (numberParam == null || numberParam === '') {
    return res.status(400).json({ error: "Parámetro inválido: se esperaba 'number' (ej: ?number=7)" });
  }

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
