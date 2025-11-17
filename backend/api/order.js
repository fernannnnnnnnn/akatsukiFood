import fs from "fs";
import path from "path";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const file = path.join(process.cwd(), "orders.json");

  const safeRead = () => {
    try {
      if (!fs.existsSync(file)) return [];
      const text = fs.readFileSync(file, "utf8").trim();
      if (!text) return [];
      return JSON.parse(text);
    } catch {
      return [];
    }
  };

  const safeWrite = (data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
  };

  if (req.method === "POST") {
    const cart = req.body;

    const orders = safeRead();

    const newOrder = {
      items: cart,
      time: new Date().toISOString(),
      total: cart.reduce((sum, x) => sum + x.price, 0),
    };

    orders.push(newOrder);
    safeWrite(orders);

    return res.status(200).json({
      message: "Order received",
      order: newOrder,
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
