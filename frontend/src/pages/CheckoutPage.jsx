import { useEffect, useState } from "react";
import QRISModal from "../components/QRISModal";
import api from "../api";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [showQRIS, setShowQRIS] = useState(false);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const sendOrder = async () => {
    await api.post("/order", { items: cart });

    new Audio("/success.mp3").play(); // audio beli

    setShowQRIS(true);
  };

  return (
    <div className="container mt-4">
      <h3>Checkout</h3>

      {cart.map((c, i) => (
        <div key={i} className="border p-2 mb-2 rounded">
          <strong>{c.name}</strong> — {c.option || "-"}  
          <br />
          Rp {c.price}
        </div>
      ))}

      <button className="btn btn-success" onClick={sendOrder}>
        Kirim Pesanan
      </button>

      <QRISModal show={showQRIS} onHide={() => {
        setShowQRIS(false);
        localStorage.removeItem("cart");
        window.location.href = "/";
      }} />
    </div>
  );
}
