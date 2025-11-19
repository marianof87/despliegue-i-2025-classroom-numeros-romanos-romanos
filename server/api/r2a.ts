// server/api/r2a.tsimport { VercelRequest, VercelResponse } from "@vercel/node";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { romanToArabic } from '../src/converters';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // --- CORS ---
  res.setHeader('Access-Control-Allow-Origin', 'https://evaluador-romanos.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  // --- END CORS ---

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const value = req.query.value;

  if (!value || Array.isArray(value)) {
    return res.status(400).json({ error: 'Debe proporcionar un número romano' });
  }

  try {
    const arabic = romanToArabic(value.toUpperCase());
    return res.status(200).json({ roman: value.toUpperCase(), arabic });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno en la conversión' });
  }
}
