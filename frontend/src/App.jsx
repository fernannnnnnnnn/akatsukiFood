import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import QRISModal from "./components/QRISModal";
import AdminPage from "./pages/AdminPage";
import posterImage from "./assets/poster.png";

function HomePage() {
  const [cart, setCart] = useState([]);
  const [selectedExtra, setSelectedExtra] = useState(null);

  const [qrisModal, setQrisModal] = useState({
    show: false,
    order: null,
  });

  // ===== TOAST FUNCTIONS =====
  const showSuccess = (msg) => {
    const toastEl = document.getElementById("toastSuccess");
    const msgEl = document.getElementById("toastSuccessMsg");

    msgEl.textContent = msg;
    const toast = new window.bootstrap.Toast(toastEl);
    toast.show();
  };

  const showError = (msg) => {
    const toastEl = document.getElementById("toastError");
    const msgEl = document.getElementById("toastErrorMsg");

    msgEl.textContent = msg;
    const toast = new window.bootstrap.Toast(toastEl);
    toast.show();
  };

  const foods = [
    {
      id: 1,
      name: "Es Krim",
      price: 5000,
      extras: ["Oreo", "Mesis"],
    },
    {
      id: 2,
      name: "Mie",
      price: 6000,
      extras: ["Goreng", "Aceh", "Rendang"],
    },
    {
      id: 3,
      name: "Bento",
      price: 13000,
      extras: ["Lada Hitam", "Aceh", "Rendang"],
    },
    {
      id: 4,
      name: "Plecing Kangkung",
      price: 10000,
      extras: ["Goreng", "Aceh", "Rendang"],
    },
  ];

  const addToCart = (food) => {
    if (!selectedExtra) {
      showError("Pilih topping/rasa dulu!");
      return;
    }

    const item = {
      ...food,
      extra: selectedExtra,
    };

    const updated = [...cart, item];
    setCart(updated);
    persistCart(updated);

    setSelectedExtra(null);
  };

  const persistCart = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  const removeFromCart = (idx) => {
    const updated = cart.filter((_, i) => i !== idx);
    setCart(updated);
    persistCart(updated);
  };

  const sendOrderAndShowQRIS = async () => {
    try {
      const res = await fetch("http://localhost:5000/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart),
      });

      if (!res.ok) throw new Error("Gagal mengirim order");

      const data = await res.json();
      console.log("ORDER SENT:", data);

      const total = cart.reduce((acc, item) => acc + item.price, 0);

      setCart([]);
      persistCart([]);

      setQrisModal({
        show: true,
        order: { total },
      });
    } catch (err) {
      console.error("ORDER ERROR:", err);
    }
  };

  const buyNow = async (food) => {
    if (!selectedExtra) {
      showError("Pilih topping/rasa dulu!");
      return;
    }

    const item = {
      ...food,
      extra: selectedExtra,
    };

    try {
      const res = await fetch("http://localhost:5000/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([item]), // kirim sebagai array 1 item
      });

      if (!res.ok) throw new Error("Gagal mengirim order");

      const data = await res.json();
      console.log("BUY NOW ORDER SENT:", data);

      // Hitung total
      const total = item.price;

      // Tampilkan QRIS
      setQrisModal({
        show: true,
        order: { total },
      });

      setSelectedExtra(null);
    } catch (err) {
      console.error("BUY NOW ERROR:", err);
    }
  };

  const onFinishPayment = () => {
    setQrisModal({ show: false, order: null });
    window.location.href = "/";
  };

  return (
    <div className="container py-4">
      <nav class="navbar navbar-expand-lg bg-transparent">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            Akatsuki Food
          </a>

          {/* Tombol Admin */}
          <div className="text-end mb-3">
            <Link to="/admin" className="btn btn-dark">
              Daftar Pesanan
            </Link>
          </div>
        </div>
      </nav>

      <div className="row">
        <div className="col-4">
          <img
            src={posterImage}
            alt="QRIS"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              marginTop: "10px",
            }}
          />
        </div>
        <div className="col-8">
          <div className="row">
            {foods.map((food) => (
              <div className="col-md-6 mb-4" key={food.id}>
                <div className="p-3 border rounded shadow-sm">
                  <h4>{food.name}</h4>
                  <p>Harga: Rp {food.price}</p>

                  <select
                    className="form-select mb-2"
                    onChange={(e) => setSelectedExtra(e.target.value)}
                  >
                    <option value="">Pilih topping/rasa</option>
                    {food.extras.map((ex, i) => (
                      <option key={i} value={ex}>
                        {ex}
                      </option>
                    ))}
                  </select>

                  <button
                    className="btn btn-primary w-100"
                    onClick={() => addToCart(food)}
                  >
                    Tambah ke Keranjang
                  </button>

                  <button
                    className="btn btn-outline-primary mt-2 w-100"
                    onClick={() => buyNow(food)}
                  >
                    Beli Langsung
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keranjang */}
      <div className="mt-5">
        <h3>🛒 Keranjang</h3>

        {cart.length === 0 ? (
          <p>Belum ada pesanan.</p>
        ) : (
          <>
            <ul className="list-group mb-3">
              {cart.map((item, idx) => (
                <li
                  key={idx}
                  className="list-group-item d-flex justify-content-between"
                >
                  <div>
                    {item.name} - {item.extra}
                  </div>
                  <div>
                    Rp {item.price}
                    <button
                      className="btn btn-danger btn-sm ms-3"
                      onClick={() => removeFromCart(idx)}
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <button
              className="btn btn-success w-100"
              onClick={sendOrderAndShowQRIS}
            >
              Checkout & Bayar
            </button>
          </>
        )}
      </div>

      {/* Modal QRIS */}
      <QRISModal
        show={qrisModal.show}
        order={qrisModal.order}
        onClose={onFinishPayment}
      />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>

      {/* TOAST SUCCESS */}
      <div
        id="toastSuccess"
        className="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body" id="toastSuccessMsg">
            Success message
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>

      {/* TOAST ERROR */}
      <div
        id="toastError"
        className="toast align-items-center text-bg-danger border-0 position-fixed bottom-0 end-0 m-3"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body" id="toastErrorMsg">
            Error message
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </>
  );
}
