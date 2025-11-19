// api/a2r.ts (DEBUG)
// Echoa la req para ver qué parámetros llegan al endpoint /a2r

export default function handler(req: any, res: any): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // Usamos Record<string, any> para permitir propiedades nuevas sin errores TS
  const payload: Record<string, any> = {
    path: req.url ?? null,
    method: req.method,
    query: req.query ?? null,
    bodyType: typeof req.body,
    body: req.body ?? null,
    headersSample: {
      host: req.headers && req.headers.host,
      'x-forwarded-for': req.headers && req.headers['x-forwarded-for'],
      'user-agent': req.headers && req.headers['user-agent']
    }
  };

  // Añadimos diagnósticos adicionales
  payload['resolvedNumber'] = (req.query && (req.query.number ?? req.query.n ?? req.query.q)) ?? null;

  res.status(200).json({ debug: payload });
}
