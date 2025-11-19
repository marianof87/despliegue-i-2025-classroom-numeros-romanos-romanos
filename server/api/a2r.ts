// server/api/a2r.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { arabicToRoman } from '../src/converters';

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
    return res.status(400).json({ error: 'Debe proporcionar un número árabe' });
  }

  const n = parseInt(value, 10);

  if (isNaN(n) || n <= 0) {
    return res.status(400).json({ error: 'El valor debe ser un número entero positivo' });
  }

  try {
    const roman = arabicToRoman(n);
    return res.status(200).json({ arabic: n, roman });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno en la conversión' });
  }
}
