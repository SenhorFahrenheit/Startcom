// Libraries
import { useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

// Components
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import ButtonLogin from "../../components/ButtonLogin/ButtonLogin";
import ForgotPasswordModal from "../../components/Modals/ForgotPasswordModal";
import AuthenticatorModal from "../../components/Modals/AuthenticatorModal";
import ChangePasswordModal from "../../components/Modals/ChangePasswordModal";
import CodeVerificationModal from "../../components/Modals/CodeVerificationModal";

// Hooks
import { useAuthModals } from "../../hooks/useAuthModals";
import { useLoginForm } from "../../hooks/useLoginForm";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { Controller } from "react-hook-form";

// Styles
import "./Auth.css";

const Auth = () => {
  const {
    activeModal,
    openAuthenticator,
    openForgot,
    openCode,
    openPassword,
    closeModal,
  } = useAuthModals();

  const [isLogin, setIsLogin] = useState(false);
  const [type, setType] = useState("cpf");

  // Login hook
  const {
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    keepLogged,
    setKeepLogged,
    handleLogin,
  } = useLoginForm();

  // Register hook
  const {
    register,
    handleSubmit,
    control,
    onSubmit,
    onError,
    validateCNPJ,
    validateCPF,
    validatePhone,
    formatCNPJ,
    formatCPF,
    formatPhone,
  } = useRegisterForm(openAuthenticator);

  const handleLoginWGoogle = () => console.log("Login with Google clicked");
  const handleLoginWApple = () => console.log("Login with Apple clicked");

  return (
    <div className="page-wrapper">
      <div className={`container ${isLogin ? "login-mode" : ""}`}>
        {/* =========================
            Login form
        ========================= */}
        <div className="form-container login">
          <h2>Login</h2>
          <form onSubmit={handleLogin} className="items-block">
            <Input
              type="email"
              placeholder="E-mail"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Senha"
              icon={<RiLockPasswordFill />}
              iconPosition="left"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <div className="forgot-password">
              <p onClick={openForgot}>Esqueceu a senha?</p>
            </div>

            {/* Social login buttons */}
            <div className="buttons-row">
              <ButtonLogin
                onClick={handleLoginWGoogle}
                type="button"
                icon={<FcGoogle />}
                iconPosition="right"
              >
                Entrar com Google
              </ButtonLogin>

              <ButtonLogin
                onClick={handleLoginWApple}
                type="button"
                icon={<FaApple />}
                iconPosition="right"
              >
                Entrar com Apple
              </ButtonLogin>
            </div>

            {/* Stay logged in option */}
            <div className="maintain-logged">
              <label>
                <input
                  type="checkbox"
                  checked={keepLogged}
                  onChange={(e) => setKeepLogged(e.target.checked)}
                />
                Manter-me conectado por 30 dias
              </label>
            </div>

            <Button label="ENTRAR" type="submit" />
          </form>
        </div>

        {/* =========================
            Register form
        ========================= */}
        <div className="form-container register">
          <h2>Cadastre-se</h2>
          <form
            className="form-register"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            {/* Name */}
            <Input
              {...register("name", { required: "Nome é obrigatório" })}
              type="text"
              placeholder="Nome"
            />

            {/* Date of birth + Phone */}
            <div className="inputs-row">
              <Input
                {...register("date", { required: "Data é obrigatória" })}
                type="date"
                placeholder="Data"
              />
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
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    value={formatPhone(value || "")}
                    onChange={(e) => onChange(e.target.value)}
                    {...field}
                  />
                )}
              />
            </div>

            {/* CPF or CNPJ selector */}
            <div className="CPF-or-CNPJ">
              <button
                className={`CPF ${type === "cpf" ? "active" : ""}`}
                type="button"
                onClick={() => setType("cpf")}
              >
                CPF
              </button>
              <button
                className={`CNPJ ${type === "cnpj" ? "active" : ""}`}
                type="button"
                onClick={() => setType("cnpj")}
              >
                CNPJ
              </button>
            </div>

            {/* Conditional rendering: CPF or CNPJ input */}
            {type === "cpf" && (
              <Controller
                name="cpf"
                control={control}
                defaultValue=""
                rules={{
                  required: "CPF é obrigatório",
                  validate: (value) =>
                    validateCPF(value) ||
                    "CPF inválido. Verifique os dígitos informados.",
                }}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    placeholder="000.000.000-00"
                    value={formatCPF(value || "")}
                    maxLength={14}
                    onChange={(e) => onChange(e.target.value)}
                    {...field}
                  />
                )}
              />
            )}

            {type === "cnpj" && (
              <Controller
                name="cnpj"
                control={control}
                defaultValue=""
                rules={{
                  required: "CNPJ é obrigatório",
                  validate: (value) =>
                    validateCNPJ(value) ||
                    "CNPJ inválido. Verifique os dígitos informados.",
                }}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    placeholder="00.000.000/0000-00"
                    value={formatCNPJ(value || "")}
                    maxLength={18}
                    onChange={(e) => onChange(e.target.value)}
                    {...field}
                  />
                )}
              />
            )}

            {/* Email */}
            <Input
              {...register("email", {
                required: "Email é obrigatório",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
              type="email"
              placeholder="E-mail"
            />

            {/* Password + Confirm Password */}
            <div className="inputs-row">
              <Input
                {...register("password", {
                  required: "Senha é obrigatória",
                })}
                icon={<RiLockPasswordFill />}
                type="password"
                placeholder="Senha"
                iconPosition="left"
              />
              <Input
                {...register("confirmPassword", {
                  required: "Confirmar a senha é obrigatório",
                  validate: (value, { password }) => {
                    if (value !== password) {
                      return "Senhas não coincidem";
                    }
                    return true;
                  },
                })}
                type="password"
                placeholder="Confirmar Senha"
              />
            </div>

            <Button label="CADASTRAR" type="submit" />
          </form>
        </div>

        {/* =========================
            Side panel
         ========================= */}
        <div className="side-panel">
          <h2>LOGO</h2>
          <p className="login-or-signin-text">
            Cadastre-se ou faça login para acessar todos os recursos!
          </p>
          <Button
            label={isLogin ? "CRIAR CONTA" : "FAZER LOGIN"}
            onClick={() => setIsLogin(!isLogin)}
            type="button"
            variant="quaternary"
          />
        </div>
      </div>

      {/* =========================
          Modals (Forgot password, Authenticator, etc.)
      ========================= */}
      <AuthenticatorModal
        isOpen={activeModal === "authenticator"}
        onClose={closeModal}
      />
      <ForgotPasswordModal
        isOpen={activeModal === "forgot"}
        onClose={closeModal}
        onSuccess={() => {
          closeModal();
          setTimeout(() => openCode(), 350);
        }}
      />
      <CodeVerificationModal
        isOpen={activeModal === "code"}
        onClose={closeModal}
        email={loginEmail}
        onSuccess={() => {
          closeModal();
          setTimeout(() => openPassword(), 350);
        }}
      />
      <ChangePasswordModal
        isOpen={activeModal === "password"}
        onClose={closeModal}
      />
    </div>
  );
};

export default Auth;
