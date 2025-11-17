import { Modal, Button } from "react-bootstrap";

export default function QRISModal({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>QRIS Pembayaran</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img
          src="/qris.jpg"
          className="img-fluid"
          alt="QRIS"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={onHide}>Selesai</Button>
      </Modal.Footer>
    </Modal>
  );
}
