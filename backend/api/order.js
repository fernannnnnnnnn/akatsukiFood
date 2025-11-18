import { ec } from '../edgeConfig';

export default async function handler(req, res) {
  // === CORS ===
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // === Handle preflight ===
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items must be non-empty array' });
    }

    const orders = (await ec.get('orders')) || [];

    const newOrder = {
      id: Date.now(),
      items,
      total: items.reduce((sum, i) => sum + (i.price || 0), 0),
      time: new Date().toISOString(),
    };

    orders.push(newOrder);
    await ec.set('orders', orders);

    return res.status(200).json({ message: 'Order diterima', order: newOrder });
  } catch (err) {
    console.error("EDGE ORDER ERROR:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
