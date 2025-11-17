import React, { useEffect, useState } from "react";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [statsToday, setStatsToday] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("https://akatsuki-food-backend.vercel.app/api/orders");
    const data = await res.json();
    setOrders(data);

    calculateStatsToday(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // HITUNG STATISTIK PESANAN HARI INI
  // =====================================================
  const calculateStatsToday = (orders) => {
    const today = new Date().toISOString().split("T")[0];

    const todayOrders = orders.filter(
      (o) => o.time && o.time.startsWith(today)
    );

    const counter = {};
    todayOrders.forEach((o) => {
      o.items.forEach((item) => {
        counter[item.name] = (counter[item.name] || 0) + 1;
      });
    });

    const entries = Object.entries(counter);
    if (entries.length === 0) {
      setStatsToday([]);
      return;
    }

    const totalItems = entries.reduce((sum, [, count]) => sum + count, 0);

    const stats = entries.map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / totalItems) * 100),
    }));

    setStatsToday(stats);
  };

  return (
    <div className="container py-4">
      <h2>📦 Daftar Pesanan Masuk</h2>
      <a href="/" className="btn btn-secondary mb-3">
        Kembali
      </a>

      {/* =====================================================
          PROGRESS BAR STATISTIK HARI INI
      ===================================================== */}
      <div className="mb-4">
        <h4>📊 Statistik Hari Ini</h4>

        {statsToday.length === 0 ? (
          <p>Belum ada pesanan hari ini.</p>
        ) : (
          statsToday.map((item, i) => (
            <div key={i} className="mb-2">
              <div className="d-flex justify-content-between">
                <strong>{item.name}</strong>
                <span>
                  {item.percent}% ({item.count}x)
                </span>
              </div>

              <div
                className="progress"
                role="progressbar"
                aria-valuenow={item.percent}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-bar bg-primary"
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>

      <hr />

      {/* =====================================================
          LIST ORDER (ACCORDION)
      ===================================================== */}
      {orders.length === 0 ? (
        <p>Belum ada pesanan.</p>
      ) : (
        <div className="accordion" id="ordersAccordion">
          {orders.map((o, i) => (
            <div className="accordion-item" key={i}>
              <h2 className="accordion-header" id={`heading-${i}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${i}`}
                >
                  <b>Order #{i + 1}</b> —{" "}
                  <small className="ms-2">
                    {new Date(o.time).toLocaleString()}
                  </small>
                </button>
              </h2>

              <div
                id={`collapse-${i}`}
                className="accordion-collapse collapse"
                data-bs-parent="#ordersAccordion"
              >
                <div className="accordion-body">

                  <b>Items:</b>
                  <ul>
                    {o.items?.map((item, idx) => (
                      <li key={idx}>
                        {item.name} — {item.extra} (Rp {item.price})
                      </li>
                    ))}
                  </ul>

                  <b>Total: Rp {o.total?.toLocaleString()}</b>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
