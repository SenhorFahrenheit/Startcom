import { useState } from "react"
import { toast } from "react-toastify"
import api from "../../services/api"

import BaseModal from "./BaseModal"
import Button from "../Button/Button"
import InputDashboard from "../InputDashboard/InputDashboard"

/**
 * DeleteAccountModal component
 * Handles user account deletion with confirmation input.
 */
const DeleteAccountModal = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Controls delete button loading state
  const [buttonLoading, setButtonLoading] =
    useState(false)

  // Validates confirmation keyword input
  const [hasWord, setHasWord] =
    useState(false)

  /**
   * Handles confirmation input changes
   */
  const handleInputChange = (e) => {
    const onlyLetters = e.target.value
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()

    e.target.value = onlyLetters
    setHasWord(onlyLetters === "DELETAR")
  }

  /**
   * Sends delete account request
   */
  const deleteAccount = async () => {
    try {
      setButtonLoading(true)

      await api.delete("/User/delete-account")

      toast.success(
        "Conta excluída com sucesso!",
        {
          position: "top-right",
          containerId: "toast-root",
        }
      )

      onClose()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast.error(
        "Falha ao excluir a conta.",
        {
          position: "top-right",
          containerId: "toast-root",
        }
      )
    } finally {
      // Keeps loading state briefly for UX feedback
      setTimeout(
        () => setButtonLoading(false),
        1300
      )
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel="Excluir Conta"
      width="420px"
      height="auto"
      showCloseButton={false}
    >
      <h2 className="dashboard-modal-title">
        Excluir Conta
      </h2>

      <p className="delete-account-description">
        Atenção: Essa ação é permanente.
        Todos os seus dados serão
        excluídos. Para continuar,
        digite DELETAR no campo abaixo.
      </p>

      {/* Confirmation input */}
      <InputDashboard
        placeholder="DELETAR"
        onChange={handleInputChange}
      />

      <p className="delete-account-description">
        Em seguida, enviaremos um e-mail
        para confirmar sua identidade.
      </p>

      {/* Action buttons */}
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
            label="Solicitar Exclusão"
            loading={buttonLoading}
            onClick={deleteAccount}
            type="button"
            disabled={!hasWord}
            buttonColor="#ff0000"
          />
        </div>
      </div>
    </BaseModal>
  )
}

export default DeleteAccountModal