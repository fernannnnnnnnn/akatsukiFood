const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// --- FUNGSI HELPER (SUDAH BENAR) ---
function safeReadJSON(file) {
  try {
    if (!fs.existsSync(file)) return [];
    const text = fs.readFileSync(file, "utf8").trim();

    if (!text) return []; // jika kosong

    return JSON.parse(text);
  } catch (err) {
    console.error("READ ERROR:", err);
    return []; // fallback tidak bikin error
  }
}

// SAVE aman
function safeWriteJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

// --- API MENERIMA ORDER (HANYA SATU INI - YANG SUDAH BENAR) ---
app.post("/order", (req, res) => {
  try {
    const orders = safeReadJSON("orders.json"); // req.body adalah array (cart), misal: [{name: "Mie", price: 10000}] // Buat objek order baru yang rapi

    const newOrder = {
      items: req.body, // Simpan array cart ke dalam properti 'items'
      time: new Date().toISOString(), // Hitung total di backend agar lebih aman
      total: req.body.reduce((acc, item) => acc + item.price, 0),
    };

    orders.push(newOrder); // Dorong objek order baru
    safeWriteJSON("orders.json", orders);

    res.json({ message: "Order received", order: newOrder });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- API MELIHAT SEMUA ORDER (HANYA SATU INI) ---
app.get("/orders", (req, res) => {
  const orders = safeReadJSON("orders.json"); // Gunakan fungsi yang aman
  res.json(orders);
});

// --- MENJALANKAN SERVER (HANYA SATU INI) ---
app.listen(5000, () => console.log("Backend running on port 5000"));
