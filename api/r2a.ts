// server/api/r2a.tsimport { VercelRequest, VercelResponse } from "@vercel/node";
import { romanToInt } from '../src/converters';

export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const { roman } = req.query;

    if (!roman || typeof roman !== "string") {
      return res.status(400).json({ error: "Parámetro inválido" });
    }

    const n = romanToInt(roman);
    return res.status(200).json({ arabic: n });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
