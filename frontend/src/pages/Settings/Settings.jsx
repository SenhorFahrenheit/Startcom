// Libs
import "./Settings.css";
import "../commonStyle.css";
import { useEffect, useState } from "react";
import { LuBuilding, LuBell } from "react-icons/lu";
import { Controller } from "react-hook-form";

// Layouts & Components
import Sidebar from "../../layouts/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import InputDashboard from "../../components/InputDashboard/InputDashboard";
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile";
import NotificationSetting from "../../components/NotificationSetting/NotificationSetting";
import { useAuthModals } from "../../hooks/useAuthModals";
import { useAuth } from "../../contexts/AuthContext";
import DeleteAccountModal from "../../components/Modals/DeleteAccount";

import { useSettingForm } from "../../hooks/useSettingForm";

import api from "../../services/api";
import { toast } from "react-toastify";
import { Delete } from "lucide-react";

const Settings = () => {
    const { token, user, isAuthenticated, pageLoading } = useAuth();
    
    useEffect(() => {
      if (!pageLoading &&!isAuthenticated) {
        window.location.href = "/login";
      }
    }, [pageLoading, isAuthenticated]);
  
    const { activeModal, openDeleteAccountModal, closeModal } = useAuthModals();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    onError,
    validatePhone,
    validateCNPJ,
    validateCPF,
    formatPhone,
    formatCPF,
    formatCNPJ
  } = useSettingForm();

  const [initialData, setInitialData] = useState(null);

  const watched = watch();

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const { data } = await api.get("/User/my-company");

        const phone = data.phone_number || "";

        const cleanedPhone = phone.startsWith("+55")
        ? phone.replace("+55", "")
        : phone;

        const formatted = {
          nameBusiness: data.name || "",
          CNPJorCPF: data.cpf_cnpj || "",
          email: data.email || "",
          telefone: cleanedPhone || "",
          address: data.address || "",
        };

        setInitialData(formatted);

        Object.entries(formatted).forEach(([key, value]) => {
          setValue(key, value);
        });

      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar dados da empresa", { position: "top-right", containerId: "toast-root" });
      }
    };

    loadCompany();
  }, []);

  const hasChanges =
    initialData &&
    Object.keys(initialData).some(key => {
      const current = (watched[key] || "").trim();
      const original = (initialData[key] || "").trim();
      return current !== original;
    });

  const onSubmit = async (formData) => {
    try {
      setButtonLoading(true)
      const payload = {
        name: formData.nameBusiness,
        cpf_cnpj: formData.CNPJorCPF.replace(/\D/g, ""),
        email: formData.email,
        telephone: `+55${formData.telefone.replace(/\D/g, "")}`,
        address: formData.address,
      };

      await api.put("/User/my-company", payload);

      toast.success("Configurações Atualizadas!", { position: "top-right", containerId: "toast-root" });

      setInitialData({
        nameBusiness: formData.nameBusiness.trim(),
        CNPJorCPF: formData.CNPJorCPF.trim(),
        email: formData.email.trim(),
        telefone: formData.telefone.trim(),
        address: formData.address.trim()
      });

    } catch (err) {
      console.error(err);
      toast.success("Erro ao salvar alterações", { position: "top-right", containerId: "toast-root" });
    } finally {
      setButtonLoading(false);
    }
  };

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
                {...register("nameBusiness", {
                  required: "Nome da empresa é obrigatório"
                })}
              />
            </div>

            <div className="form-setting-gap">
              <label htmlFor="CNPJorCPF">CNPJ ou CPF</label>

              <Controller
                name="CNPJorCPF"
                control={control}
                defaultValue=""
                rules={{
                  required: "Documento é obrigatório",
                  validate: (value) => {
                    const digits = value.replace(/\D/g, "");
                    if (digits.length === 11) {
                      return validateCPF(value) || "CPF inválido.";
                    }
                    if (digits.length === 14) {
                      return validateCNPJ(value) || "CNPJ inválido.";
                    }
                    return "CPF/CNPJ inválido.";
                  },
                }}
                render={({ field: { onChange, value, ...field } }) => {
                  const digits = (value || "").replace(/\D/g, "");
                  const isCPF = digits.length <= 11;

                  return (
                    <InputDashboard
                      placeholder={isCPF ? "000.000.000-00" : "00.000.000/0000-00"}
                      maxLength={isCPF ? 14 : 18}
                      value={isCPF ? formatCPF(value || "") : formatCNPJ(value || "")}
                      onChange={(e) => onChange(e.target.value)}
                      {...field}
                    />
                  );
                }}
              />

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
                    message: "Email inválido"
                  }
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
                  validate: v =>
                    validatePhone(v) || "Telefone inválido. Use (00) 00000-0000"
                }}
                render={({ field: { onChange, value } }) => (
                  <InputDashboard
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    value={formatPhone(value || "")}
                    onChange={e => onChange(e.target.value)}
                  />
                )}
              />
            </div>
          </div>

          <div className="form-setting-gap-unique">
            <label htmlFor="address">Endereço</label>
            <InputDashboard
              id="address"
              {...register("address", {
                required: "Endereço obrigatório"
              })}
            />
          </div>

          <div className="setting-changes">
            <div className="button-shadown">
              <Button
                className={`hover-dashboard`}
                width={180}
                buttonColor="#ff4d4f"
                type="button"
                label={<>Excluir Conta</>}
                onClick={openDeleteAccountModal} 
              />
            </div>
            <div className="button-shadown">
              <Button
                className={`hover-dashboard`}
                width={180}
                type="submit"
                loading={buttonLoading}
                disabled={!hasChanges}
                label={<>Salvar Alterações</>}
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
              state="defaultChecked"
            />

            <NotificationSetting
              title="Novas Vendas"
              description="Receber notificação a cada nova venda concluída."
              state="defaultChecked"
            />

            <NotificationSetting
              title="Relatórios Semanais"
              description="Receber um resumo do desempenho da semana por e-mail."
            />

            <NotificationSetting
              title="Novo Cliente"
              description="Receber aviso sempre que um novo cliente for cadastrado no sistema."
            />
          </section>
        </div>
      </div>
      
      <DeleteAccountModal
        isOpen={activeModal === "deleteAccount"}
        onClose={closeModal}
        onSuccess={() => {
          window.location.href = "/"
        }}
      />
    </section>
  );
};

export default Settings;