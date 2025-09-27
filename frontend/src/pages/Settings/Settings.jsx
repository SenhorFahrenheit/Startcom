// Libs
import "./Settings.css"
import "../commonStyle.css"
import { useState } from "react"
import { LuBuilding, LuSave, LuBell } from "react-icons/lu"

// Layouts & Components
import Sidebar from "../../layouts/Sidebar/Sidebar"
import Button from "../../components/Button/Button"
import InputDashboard from "../../components/InputDashboard/InputDashboard"
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile"
import NotificationSetting from "../../components/NotificationSetting/NotificationSetting"
import { useSettingForm } from "../../hooks/useSettingForm"

import { Controller } from "react-hook-form";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = () => setSidebarOpen(prev => !prev)

  const {
  register,
  handleSubmit,
  onSubmit,
  onError,
  control,
  validatePhone,
  formatPhone,
  validateCNPJ,
  formatCNPJ,
} = useSettingForm()

  return (
    <section className="body-section">
      <HeaderMobile onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      <div className="content-page-section setting-page">
        <div className="align-heading">
          <div>
            <h1 className="title-page-section">Configurações</h1>
            <p className="description-page-section">
              Gerencie as preferências da sua conta e notificações
            </p>
          </div>
        </div>

        <form className="settings-container-form" onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="settings-title">
            <LuBuilding size={20} color="var(--primary-color)" />
            <h3>Perfil da Empresa</h3>
          </div>

          <div className="form-setting-group">
            <div className="form-setting-gap">
              <label htmlFor="nameBusiness">Nome da Empresa</label>
              <InputDashboard
                id="nameBusiness"
                {...register("nameBusiness", { required: "Nome da empresa é obrigatório" })}
              />
            </div>

            <div className="form-setting-gap">
              <label htmlFor="CNPJorCPF">CNPJ ou CPF</label>
              <Controller
                name="CNPJorCPF"
                control={control}
                defaultValue=""
                rules={{
                  required: "CNPJ é obrigatório",
                  validate: (value) =>
                    validateCNPJ(value) ||
                    "CNPJ inválido. Verifique os dígitos informados.",
                }}
                render={({ field: { onChange, value, ...field } }) => (
                  <InputDashboard
                    placeholder="00.000.000/0000-00"
                    value={formatCNPJ(value || "")}
                    maxLength={18}
                    onChange={(e) => onChange(e.target.value)}
                    {...field}
                  />
                )}/>
            </div>
          </div>

          <div className="form-setting-group">
            <div className="form-setting-gap">
              <label htmlFor="email">E-mail</label>
              <InputDashboard
                id="email"
                {...register("email", {
                  required: "Email é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                })}
              />
            </div>

            <div className="form-setting-gap">
              <label htmlFor="telefone">Telefone</label>
              <Controller
                name="telefone"
                control={control}
                defaultValue=""
                rules={{
                  required: "Telefone é obrigatório",
                  validate: (value) =>
                    validatePhone(value) ||
                    "Telefone inválido. Use formato: (00) 00000-0000",
                }}
                render={({ field: { onChange, value } }) => (
                  <InputDashboard
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    value={formatPhone(value || "")}
                    onChange={(e) => onChange(e.target.value)}
                  />)}
              />
            </div>
          </div>

          <div className="form-setting-gap-unique">
            <label htmlFor="address">Endereço</label>
            <InputDashboard
              id="address"
              {...register("address", { required: "Endereço obrigatório" })}
            />
          </div>

          <div className="setting-save-changes">
            <div className="button-shadown">
            <Button 
              className="hover-dashboard"
              width={200}
              type="submit"
              label={
                <>
                  <LuSave size={18} /> Salvar Alterações
                </>
              }
            />
            </div>
          </div>
        </form>

        <div className="notification-settings">
          <div className="settings-title">
            <LuBell size={20} color="var(--primary-color)" />
            <h3>Notificações</h3>
          </div>
          
          <section className="notificationSettings">
            <NotificationSetting 
              title="Estoque Baixo" 
              description="Receber alerta quando um produto atingir o estoque mínimo."
              state="checked"
            />

            <NotificationSetting 
              title="Novas Vendas"
              description="Receber notificação a cada nova venda concluída."
              state="checked"
            />

            <NotificationSetting 
              title="Relatórios Semanais"
              description="Receber um resumo do desempenho da semana por e-mail."
            />

            <NotificationSetting 
              title="Lembretes de Tarefas"
              description="Ser lembrado de tarefas pendentes e agendadas."
              state="checked"
            />    
          </section>
        </div>

      </div>
    </section>
  )
}

export default Settings
