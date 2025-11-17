import { Card, Button } from "react-bootstrap";

export default function FoodCard({ food, onAdd }) {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Img variant="top" src={food.image} />
      <Card.Body>
        <Card.Title>{food.name}</Card.Title>
        <Card.Text>{food.description}</Card.Text>
        <h5>Rp {food.price}</h5>

        <Button variant="primary" onClick={() => onAdd(food)}>
          Tambah ke Keranjang
        </Button>
      </Card.Body>
    </Card>
  );
}
