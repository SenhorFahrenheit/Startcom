import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

import BaseModal from "./BaseModal";
import Button from "../Button/Button";

const DeleteClientModal = ({ isOpen, onClose, onSuccess, clientData }) => {
  const [buttonLoading, setButtonLoading] = useState(false);

  if (!clientData) return null;

  const deleteClient = async () => {
    try {
      setButtonLoading(true);

      await api.delete(`/Company/clients/${clientData.clientId}`);

      toast.success("Cliente excluído com sucesso!", {
        position: "top-right",
        containerId: "toast-root",
      });

      onClose();
      if (onSuccess) onSuccess(clientData.clientId);

    } catch (error) {
      const status = error.response?.status;

      if (status === 404) {
        toast.error("Cliente não encontrado.", {
          position: "top-right",
          containerId: "toast-root",
        });
      } else {
        toast.error("Falha ao excluir o cliente.", {
          position: "top-right",
          containerId: "toast-root",
        });
      }

    } finally {
      setTimeout(() => setButtonLoading(false), 1300);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel="Excluir Cliente"
      width="420px"
      height={"auto"}
      showCloseButton={false}
    >
      <h2 className="dashboard-modal-title">Excluir Cliente</h2>

      <p className="delete-client-description">
        Tem certeza que deseja excluir o cliente
        <strong> {clientData.clientName}</strong>?<br />
        Essa ação é permanente e não pode ser desfeita.
      </p>

      <div className="modal-buttons-row">
        <div className="button-shadown">
          <Button
            height={45}
            width={160}
            label="Cancelar"
            onClick={onClose}
            type="button"
          />
        </div>
        <div className="button-shadown">
          <Button
            height={45}
            width={160}
            label="Excluir"
            loading={buttonLoading}
            onClick={deleteClient}
            type="button"
            buttonColor={"#ff0000"}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteClientModal;
