// server/src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { intToRoman, romanToInt } from './converters';

const app = express();

// Lista blanca de orígenes permitidos (agregá aquí otros orígenes necesarios)
const WHITE_LIST = [
  'http://localhost:5173',                     // tu Vite local
  'https://evaluador-romanos.vercel.app',     // evaluador (NECESARIO)
  'https://roman-converter-beryl.vercel.app'  // tu deploy en Vercel (si lo usás desde ahí)
];

// Delegado CORS que permite solo orígenes de la whitelist
const corsOptionsDelegate = (req: Request, callback: (err: Error | null, options?: cors.CorsOptions) => void) => {
  const origin = req.header('Origin') || '';
  if (WHITE_LIST.includes(origin)) {
    callback(null, { origin: true, credentials: true, methods: ['GET','POST','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] });
  } else {
    // Si querés permitir cualquier origen en dev, retorná { origin: true } aquí,
    // pero para el evaluador conviene que el origin esté en la whitelist.
    callback(null, { origin: false });
  }
};

app.use(cors(corsOptionsDelegate));
app.options('*', cors(corsOptionsDelegate)); // preflight
app.use(express.json());

/**
 * RUTAS REQUERIDAS POR EL EVALUADOR
 *
 * GET /a2r?arabic=123    -> { "roman": "CXXIII" }  (200)
 * GET /r2a?roman=CXXIII  -> { "arabic": 123 }       (200)
 *
 * Si parámetros ausentes o inválidos -> 400 con JSON { error: '...' }
 */

// GET arabic -> roman
app.get('/a2r', (req: Request, res: Response) => {
  try {
    const arabicRaw = req.query.arabic;
    if (arabicRaw === undefined) return res.status(400).json({ error: 'Parámetro "arabic" faltante' });

    // Puede venir como string (query). Intentamos convertir.
    const n = typeof arabicRaw === 'string' ? Number(arabicRaw) : Number(arabicRaw);
    if (!Number.isFinite(n) || !Number.isInteger(n)) return res.status(400).json({ error: 'Parámetro "arabic" inválido (debe ser entero)' });

    // comprobar rango según tu conversor
    if (n <= 0 || n >= 4000) return res.status(400).json({ error: 'Soportado de 1 a 3999' });

    const roman = intToRoman(n);
    return res.status(200).json({ roman });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message ?? String(err) });
  }
});

// GET roman -> arabic
app.get('/r2a', (req: Request, res: Response) => {
  try {
    const romanRaw = req.query.roman;
    if (romanRaw === undefined) return res.status(400).json({ error: 'Parámetro "roman" faltante' });
    if (typeof romanRaw !== 'string') return res.status(400).json({ error: 'Parámetro "roman" inválido' });

    const n = romanToInt(romanRaw);
    return res.status(200).json({ arabic: n });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message ?? String(err) });
  }
});

/* --- Mantengo tus endpoints POST originales (opcionales) --- */

app.post('/api/to-roman', (req: Request, res: Response) => {
  try {
    const { value } = req.body;
    const n = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(n)) return res.status(400).json({ error: 'Valor no numérico' });
    const roman = intToRoman(n);
    return res.json({ roman });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message ?? String(err) });
  }
});

app.post('/api/from-roman', (req: Request, res: Response) => {
  try {
    const { roman } = req.body;
    if (typeof roman !== 'string') return res.status(400).json({ error: 'Se espera string' });
    const n = romanToInt(roman);
    return res.json({ number: n });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message ?? String(err) });
  }
});

/* --- Fin --- */

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});