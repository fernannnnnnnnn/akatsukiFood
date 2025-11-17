import React from "react";
import qrisImage from "../assets/qris.png";

export default function QRISModal({ show, order, onClose }) {
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        background: "rgba(0,0,0,0.5)",
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: "500px" }}
      >
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">QRIS Pembayaran</h5>
            <button
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body text-center">
            <h4>Total: Rp {order?.total?.toLocaleString()}</h4>

            <img
              src={qrisImage}
              alt="QRIS"
              style={{
                width: "300px",
                height: "300px",
                objectFit: "contain",
                marginTop: "10px",
              }}
            />
          </div>

          <div className="modal-footer">
            <button className="btn btn-success w-100" onClick={onClose}>
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
