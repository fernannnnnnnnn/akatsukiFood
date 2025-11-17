import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const foods = [
  {
    id: "eskrim",
    name: "Eskrim",
    description: "Eskrim lembut manis.",
    price: 12000,
    img: "/assets/eskrim.jpg",
    options: ["Oreo", "Mesis"],
  },
  {
    id: "mie",
    name: "Mie",
    description: "Mie dengan berbagai rasa.",
    price: 15000,
    img: "/assets/mie.jpg",
    options: ["Goreng", "Aceh", "Rendang"],
  },
  {
    id: "bento",
    name: "Bento",
    description: "Bento spesial.",
    price: 25000,
    img: "/assets/bento.jpg",
    options: ["Keju", "Lada Hitam", "Hot Lava"],
  },
  {
    id: "plecing",
    name: "Plecing Kangkung",
    description: "Plecing pedas segar.",
    price: 10000,
    img: "/assets/plecing.jpg",
    options: null,
  },
];

export default function MenuPage({ onAdd, onBuyNow }) {
  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Menu Makanan</h1>
      <Row className="g-4">
        {foods.map((food) => (
          <Col key={food.id} md={6} lg={3}>
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={food.img} style={{ height: 190, objectFit: "cover" }} />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{food.name}</Card.Title>
                <Card.Text className="text-muted small">{food.description}</Card.Text>
                <div className="mt-auto">
                  <div className="fw-bold mb-2">Rp {food.price.toLocaleString()}</div>
                  <div className="d-grid gap-2">
                    <Button variant="primary" onClick={() => onAdd(food)}>Tambah ke Keranjang</Button>
                    <Button variant="success" onClick={() => onBuyNow(food)}>Beli Langsung</Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
