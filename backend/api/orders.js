import fs from "fs";
import path from "path";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const filePath = path.join(process.cwd(), "orders.json");

    if (!fs.existsSync(filePath)) {
      return res.json([]);
    }

    const text = fs.readFileSync(filePath, "utf8") || "[]";
    const orders = JSON.parse(text);

    return res.json(orders);
  } catch (err) {
    console.error("READ ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
