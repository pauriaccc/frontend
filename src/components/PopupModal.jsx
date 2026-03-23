export default function Modal({ header, message, onClose }) {
  const overlayClass = header.toLowerCase() === "success" ? "blur-overlay" : "modal-overlay";
  return (
    <div className={overlayClass}>
      <div className="modal-card">
        <h2>{header}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="submit-button" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}