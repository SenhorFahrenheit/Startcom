import Modal from "react-modal";

import "./ForgotPasswordModal.css"

const ForgotPasswordModal = ({ isOpen, onClose }) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Recuperar Senha"
      overlayClassName="modal-overlay"
      className="modal-content"
      closeTimeoutMS={300}
    >
      {/*Modal elements here*/}
      <button onClick={onClose}>Fechar</button>
    </Modal>
  );
};

export default ForgotPasswordModal;
