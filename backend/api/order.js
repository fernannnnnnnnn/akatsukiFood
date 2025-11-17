import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Untuk preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Hanya support POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // HARUS diparse manual, karena req.body masih berupa string mentah!
    const rawBody =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body);

    const cart = JSON.parse(rawBody);

    const filePath = path.join(process.cwd(), "orders.json");

    let orders = [];
    if (fs.existsSync(filePath)) {
      const text = fs.readFileSync(filePath, "utf8") || "[]";
      orders = JSON.parse(text);
    }

    const newOrder = {
      items: cart,
      time: new Date().toISOString(),
      total: cart.reduce((sum, x) => sum + x.price, 0),
    };

    orders.push(newOrder);

    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), "utf8");

    return res.status(200).json({
      message: "Order received",
      order: newOrder,
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
