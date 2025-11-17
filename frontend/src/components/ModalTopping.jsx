import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";

export default function ModalTopping({ show, onHide, food, onConfirm }) {
  const [selected, setSelected] = useState("");

  if (!food) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Pilih Varian {food.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {food.options.map((o) => (
          <Form.Check
            key={o}
            label={o}
            name="topping"
            type="radio"
            value={o}
            onChange={(e) => setSelected(e.target.value)}
          />
        ))}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Batal
        </Button>
        <Button
          variant="primary"
          disabled={!selected}
          onClick={() => onConfirm(selected)}
        >
          Tambahkan
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
