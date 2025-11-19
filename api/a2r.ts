// server/api/a2r.ts
import { intToRoman } from '../src/converters';

export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const { arabic } = req.query;
    const n = Number(arabic);

    if (!arabic || Number.isNaN(n)) {
      return res.status(400).json({ error: "Parámetro inválido" });
    }

    const roman = intToRoman(n);
    return res.status(200).json({ roman });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
