import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function CartPage({ cart, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <Container className="mt-4">
      <h2 className="fw-bold mb-3">Keranjang</h2>

      {cart.length === 0 ? (
        <p>Keranjang kosong.</p>
      ) : (
        cart.map((item, index) => (
          <Card key={index} className="p-3 mb-2 shadow-sm">
            <h5>{item.name}</h5>
            <p>Rp {item.price.toLocaleString()}</p>
            <Button
              variant="danger"
              size="sm"
              onClick={() => removeFromCart(index)}
            >
              Hapus
            </Button>
          </Card>
        ))
      )}

      <h3 className="mt-3 fw-bold">Total: Rp {total.toLocaleString()}</h3>

      <Button as={Link} to="/checkout" variant="success" className="mt-3">
        Checkout
      </Button>
    </Container>
  );
}
