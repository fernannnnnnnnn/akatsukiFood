import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function ToppingModal({ show, onHide, food, mode = "add", onConfirm }) {
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (food && food.options && food.options.length > 0) setSelected(food.options[0]);
    else setSelected("");
  }, [food]);

  if (!food) return null;

  const handleConfirm = () => {
    onConfirm(food, selected || null, mode);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{mode === "buy" ? "Beli Sekarang" : "Tambah ke Keranjang"} — {food.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {food.options && food.options.length > 0 ? (
          <Form>
            {food.options.map((opt) => (
              <Form.Check
                key={opt}
                type="radio"
                name="option"
                id={`${food.id}-${opt}`}
                label={opt}
                checked={selected === opt}
                onChange={() => setSelected(opt)}
              />
            ))}
          </Form>
        ) : (
          <p>Tidak ada pilihan. Tekan konfirmasi untuk melanjutkan.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Batal</Button>
        <Button variant="primary" onClick={handleConfirm} disabled={food.options && food.options.length > 0 && !selected}>
          {mode === "buy" ? "Bayar Sekarang" : "Tambahkan"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
