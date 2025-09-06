import BaseModal from "./BaseModal";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} contentLabel="Recuperar Senha" width="320px" height="500px">
    </BaseModal>
  );
};

export default ForgotPasswordModal;
