import React from "react";
import { Container, Card, Button } from "react-bootstrap";

export default function CartPage({ cart, removeFromCart, buyNowFromCart }) {
  const total = cart.reduce((s, i) => s + (i.price || 0), 0);

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Keranjang</h2>
      {cart.length === 0 ? (
        <p>Keranjang kosong.</p>
      ) : (
        <>
          {cart.map((it, idx) => (
            <Card key={idx} className="p-3 mb-2 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold">{it.name} {it.chosenOption ? `- ${it.chosenOption}` : ""}</div>
                  <div className="small text-muted">Rp {it.price?.toLocaleString()}</div>
                </div>
                <div>
                  <Button variant="danger" size="sm" onClick={() => removeFromCart(idx)}>Hapus</Button>
                </div>
              </div>
            </Card>
          ))}

          <div className="mt-3">
            <h5>Total: Rp {total.toLocaleString()}</h5>
            <Button variant="success" onClick={buyNowFromCart}>Checkout Semua</Button>
          </div>
        </>
      )}
    </Container>
  );
}
