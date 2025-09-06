import Modal from "react-modal";
import "./Modals.css";

const BaseModal = ({
  isOpen,
  onClose,
  children,
  contentLabel,
  width = "90%",
  height = "auto",
  className = "",
  showCloseButton = true,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={contentLabel}
      overlayClassName="modal-overlay"
      className={`modal-content ${className}`}
      closeTimeoutMS={300}
      style={{
        content: { width, height, margin: "auto" },
      }}
    >
      {showCloseButton && <button className="close-btn" onClick={onClose}>X</button>}
      {children}
    </Modal>
  );
};

export default BaseModal;
