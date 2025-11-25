import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

import BaseModal from "./BaseModal";
import Button from "../Button/Button";

const DeleteProductModal = ({ isOpen, onClose, onSuccess, product }) => {
  const [buttonLoading, setButtonLoading] = useState(false);

  if (!product) return null;

  const deleteProduct = async () => {
    try {
      setButtonLoading(true);

      await api.delete(`/Company/inventory/${product.productId}`);

      toast.success("Produto excluído com sucesso!", {
        position: "top-right",
        containerId: "toast-root",
      });

      onClose();
      if (onSuccess) onSuccess(product.productId);

    } catch (error) {
      const status = error.response?.status;

      if (status === 404) {
        toast.error("Produto não encontrado.", {
          position: "top-right",
          containerId: "toast-root",
        });
      } else {
        toast.error("Falha ao excluir o produto.", {
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
      contentLabel="Excluir Produto"
      width="420px"
      height="auto"
      showCloseButton={false}
    >
      <h2 className="dashboard-modal-title">Excluir Produto</h2>

      <p className="delete-client-description">
        Tem certeza que deseja excluir o produto
        <strong> {product.name}</strong>?<br />
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
            onClick={deleteProduct}
            type="button"
            buttonColor="#ff0000"
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteProductModal;
