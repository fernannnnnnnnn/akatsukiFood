const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Path absolut untuk orders.json (supaya tidak error ketika dijalankan dari folder lain)
const DATA_FILE = path.join(__dirname, "orders.json");

// --- FUNGSI AMAN UNTUK BACA ---
function safeReadJSON(file) {
  try {
    if (!fs.existsSync(file)) return [];
    const content = fs.readFileSync(file, "utf8").trim();
    if (!content) return [];
    return JSON.parse(content);
  } catch (err) {
    console.error("READ ERROR:", err);
    return [];
  }
}

// --- FUNGSI AMAN UNTUK WRITE ---
function safeWriteJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("WRITE ERROR:", err);
  }
}

// === ROUTE ROOT (untuk test backend) ===
app.get("/", (req, res) => {
  res.send("Backend Akatsuki Food is Running!");
});

// === POST ORDER ===
app.post("/order", (req, res) => {
  try {
    const cart = req.body; // array pesanan
    const orders = safeReadJSON(DATA_FILE);

    const newOrder = {
      items: cart,
      time: new Date().toISOString(),
      total: cart.reduce((sum, item) => sum + item.price, 0),
    };

    orders.push(newOrder);
    safeWriteJSON(DATA_FILE, orders);

    res.json({
      message: "Order received",
      order: newOrder,
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// === GET SEMUA ORDER ===
app.get("/orders", (req, res) => {
  const orders = safeReadJSON(DATA_FILE);
  res.json(orders);
});

// === JALANKAN SERVER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server berjalan di http://localhost:" + PORT);
});
