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
    // PARSE BODY (WAJIB UNTUK VERCEL SERVERLESS)
    let body = "";
    await new Promise((resolve) => {
      req.on("data", (chunk) => (body += chunk));
      req.on("end", resolve);
    });

    const items = JSON.parse(body || "[]");

    // VALIDASI: harus array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Bad request: Items must be a non-empty array" });
    }

    // HITUNG TOTAL
    const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

    const order = {
      id: Date.now(),
      items,
      total,
      time: new Date().toISOString(),
    };

    return res.status(200).json({
      message: "Order diterima!",
      order,
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
