import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import api from "../../services/api"

import BaseModal from "./BaseModal"
import Button from "../Button/Button"
import InputDashboard from "../InputDashboard/InputDashboard"
import InfoToolTip from "../InfoTooltip/InfoTooltip"

import { formatPhone } from "../../utils/format"

/**
 * ModifyClientModal
 * Modal responsible for editing an existing client
 */
const ModifyClientModal = ({
  isOpen,
  onClose,
  onSuccess,
  clientData,
}) => {
  const [buttonLoading, setButtonLoading] = useState(false)

  // Form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [phone, setPhone] = useState("")

  // Keeps original data to detect changes
  const [initialData, setInitialData] = useState(null)

  /**
   * Handles phone input formatting
   */
  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value))
  }

  /**
   * Loads client data when modal opens
   */
  useEffect(() => {
    if (!clientData || !isOpen) return

    let rawPhone = clientData.phoneNumber || ""
    rawPhone = rawPhone.replace(/^\+55/, "")
    const formattedPhone = formatPhone(rawPhone)

    const filledData = {
      name: clientData.clientName || "",
      email: clientData.email || "",
      phone: formattedPhone,
      city: clientData.city || "",
    }

    setName(filledData.name)
    setEmail(filledData.email)
    setPhone(filledData.phone)
    setCity(filledData.city)

    setInitialData(filledData)
  }, [clientData, isOpen])

  /**
   * Checks if at least one field changed
   */
  const isDirty =
    initialData &&
    (
      name !== initialData.name ||
      email !== initialData.email ||
      phone !== initialData.phone ||
      city !== initialData.city
    )

  /**
   * Submits updated client data
   */
  const modifyClient = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    let hasError = false

    if (!data.name?.trim()) {
      toast.error("O campo Nome não pode estar vazio!", { containerId: "toast-root" })
      hasError = true
    }

    if (!data.email?.trim()) {
      toast.error("O campo Email não pode estar vazio!", { containerId: "toast-root" })
      hasError = true
    }

    if (!data.phone?.trim()) {
      toast.error("O campo Telefone não pode estar vazio!", { containerId: "toast-root" })
      hasError = true
    }

    if (!data.city?.trim()) {
      toast.error("O campo Cidade não pode estar vazio!", { containerId: "toast-root" })
      hasError = true
    }

    if (hasError) return

    const body = {
      client_id: clientData.id,
      name: data.name,
      email: data.email,
      phone: "+55" + data.phone.replace(/\D/g, ""),
      address: data.city,
    }

    try {
      setButtonLoading(true)

      const response = await api.put(
        "/Company/clients/update_client",
        body
      )

      toast.success("Cliente atualizado com sucesso!", {
        containerId: "toast-root",
      })

      onClose()
      if (onSuccess) onSuccess(response.data)

    } catch (error) {
      const status = error.response?.status

      if (status === 409) {
        toast.error(
          "Já existe um cliente com esse nome ou e-mail.",
          { containerId: "toast-root" }
        )
      } else if (status === 404) {
        toast.error("Cliente não encontrado.", { containerId: "toast-root" })
      } else if (status === 400) {
        toast.error("ID de cliente inválido.", { containerId: "toast-root" })
      } else {
        toast.error("Falha ao atualizar o cliente.", { containerId: "toast-root" })
      }

    } finally {
      setTimeout(() => setButtonLoading(false), 1500)
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel="Modificar Cliente"
      width="430px"
      height="auto"
      showCloseButton
    >
      <h2 className="dashboard-modal-title">
        Modificar Cliente
      </h2>

      <form className="form-dashboard" onSubmit={modifyClient}>
        <div className="align-dashboard-form">

          {/* Nome */}
          <div className="input-dashboard-block">
            <label htmlFor="name">Nome</label>
            <InputDashboard
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InfoToolTip text="Nome completo do cliente. Ex.: Maria da Silva" />
          </div>

          {/* Email */}
          <div className="input-dashboard-block">
            <label htmlFor="email">Email</label>
            <InputDashboard
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InfoToolTip text="Email para contato. Ex.: maria.silva@gmail.com" />
          </div>

          {/* Telefone */}
          <div className="input-dashboard-block">
            <label htmlFor="phone">Telefone</label>
            <InputDashboard
              type="tel"
              maxLength={15}
              name="phone"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
            />
            <InfoToolTip text="Telefone principal do cliente. Ex.: (11) 91234-5678" />
          </div>

          {/* Cidade */}
          <div className="input-dashboard-block">
            <label htmlFor="city">Cidade</label>
            <InputDashboard
              name="city"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <InfoToolTip text="Cidade onde o cliente reside. Ex.: São Paulo" />
          </div>

        </div>

        {/* Submit */}
        <div className="button-shadown">
          <Button
            height={45}
            width={200}
            loading={buttonLoading}
            type="submit"
            label="Salvar Cliente"
            disabled={!isDirty}
          />
        </div>
      </form>
    </BaseModal>
  )
}

export default ModifyClientModal