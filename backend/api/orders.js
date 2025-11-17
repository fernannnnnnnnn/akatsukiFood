import fs from "fs";

function safeReadJSON(file) {
  try {
    if (!fs.existsSync(file)) return [];
    const text = fs.readFileSync(file, "utf8").trim();
    if (!text) return [];
    return JSON.parse(text);
  } catch {
    return [];
  }
}

export default function handler(req, res) {
  const orders = safeReadJSON("orders.json");
  res.status(200).json(orders);
}
