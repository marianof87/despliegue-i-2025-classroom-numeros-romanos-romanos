import express from 'express';
import cors from 'cors';
import { intToRoman, romanToInt } from './converters';

const app = express();

// Configuración CORS
const corsOptions = {
  origin: 'http://localhost:5173', // dominio de tu cliente Vite
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 
app.use(express.json());

// Endpoint: convertir número -> romano
app.post('/api/to-roman', (req, res) => {
  try {
    const { value } = req.body;
    const n = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(n)) return res.status(400).json({ error: 'Valor no numérico' });
    const roman = intToRoman(n);
    return res.json({ roman });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Endpoint: convertir romano -> número
app.post('/api/from-roman', (req, res) => {
  try {
    const { roman } = req.body;
    if (typeof roman !== 'string') return res.status(400).json({ error: 'Se espera string' });
    const n = romanToInt(roman);
    return res.json({ number: n });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
