const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/order", (req, res) => {
  const data = req.body;

  const orders = JSON.parse(fs.readFileSync("orders.json", "utf8") || "[]");
  orders.push({ ...data, time: new Date() });

  fs.writeFileSync("orders.json", JSON.stringify(orders, null, 2));

  res.json({ message: "Order received" });
});

app.get("/orders", (req, res) => {
  const orders = JSON.parse(fs.readFileSync("orders.json"));
  res.json(orders);
});

app.listen(5000, () => console.log("Backend running on port 5000"));
