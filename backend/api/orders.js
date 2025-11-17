import fs from "fs";
import path from "path";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const file = path.join(process.cwd(), "orders.json");

  try {
    if (!fs.existsSync(file)) {
      return res.json([]);
    }

    const text = fs.readFileSync(file, "utf8").trim();
    const data = text ? JSON.parse(text) : [];

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to read file" });
  }
}
