// api/a2r.js (DEBUG) - devuelve lo que llega al endpoint /a2r
module.exports = (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const payload = {
    now: new Date().toISOString(),
    path: req.url || null,
    method: req.method,
    query: req.query || null,
    rawUrl: req.originalUrl || null,
    bodyType: typeof req.body,
    body: req.body || null,
    headers: {
      host: req.headers && req.headers.host,
      'x-forwarded-for': req.headers && req.headers['x-forwarded-for'],
      'user-agent': req.headers && req.headers['user-agent']
    }
  };

  // extraemos las claves posibles para diagnóstico
  try {
    payload.resolved = {
      number: (req.query && (req.query.number || req.query.n || req.query.num || req.query.value || req.query.q)) ?? null
    };
  } catch (e) {
    payload.resolved = { error: 'error reading query' };
  }

  return res.status(200).json({ debug: payload });
};
