export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "https://akatsuki-food-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Data dari frontend
    const { item, price, toppings, quantity } = req.body;

    if (!item || !price) {
      return res.status(400).json({ error: "Bad request: missing data" });
    }

    // Simulasi penyimpanan order (tanpa DB)
    const order = {
      id: Date.now(),
      item,
      price,
      toppings: toppings || null,
      quantity: quantity || 1,
      time: new Date().toISOString(),
    };

    return res.status(200).json({
      message: "Order berhasil diterima!",
      order,
    });

  } catch (error) {
    console.error("Order error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
