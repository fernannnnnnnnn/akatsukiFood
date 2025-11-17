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

function safeWriteJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const cart = req.body;
  const orders = safeReadJSON("orders.json");

  const newOrder = {
    items: cart,
    time: new Date().toISOString(),
    total: cart.reduce((acc, item) => acc + item.price, 0),
  };

  orders.push(newOrder);
  safeWriteJSON("orders.json", orders);

  return res.status(200).json({
    message: "Order received",
    order: newOrder,
  });
}
