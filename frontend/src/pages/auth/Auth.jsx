// Libraries
import { toast } from "react-toastify"; // Toast notifications

// React Hooks
import { useState } from "react";
import { useForm, Controller } from "react-hook-form"; // Form management

// Custom Components
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import ButtonLogin from "../../components/ButtonLogin/ButtonLogin";
import ForgotPasswordModal from "../../components/Modals/ForgotPasswordModal";
import CodeVerificationModal from "../../components/Modals/CodeVerificationModal";
import ChangePasswordModal from "../../components/Modals/ChangePasswordModal";
import AuthenticatorModal from "../../components/Modals/AuthenticatorModal";

// Icons
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

// Styles
import "./Auth.css";

// Utility functions
import { validateCNPJ, validateCPF, validatePhone } from "../../utils/validations";
import { formatCNPJ, formatCPF, formatPhone } from "../../utils/format";

const Auth = () => {
  // State to toggle between login and register mode
  const [isLogin, setIsLogin] = useState(false);

  // State to control which document type is selected: CPF or CNPJ
  const [type, setType] = useState("cpf");

  // Modals control
  const [isAuthenticatorOpen, setIsAuthenticatorOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false); // "Stay logged in" option

  // React Hook Form setup
  const { register, handleSubmit, control } = useForm();

  // Handle registration submit
  const onSubmit = (data) => {
    console.log("Register:", data);
    setIsAuthenticatorOpen(true); // Open 2FA modal after registration
  };

  // Handle validation errors in registration
  const onError = (errors) => {
    Object.values(errors).forEach((err) =>
      toast.error(err.message, { theme: "light", containerId: "toast-root" })
    );
  };

  // Login logic
  const handleLogin = (e) => {
    e.preventDefault();

    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Preencha e-mail e senha para entrar.", {
        position: "top-center",
        containerId: "toast-root",
      });
      return;
    }

    console.log("Login:", { loginEmail, loginPassword, keepLogged });
    toast.success("Login realizado!", {
      position: "top-center",
      containerId: "toast-root",
    });
  };

  const handleLoginWGoogle = () => {
    console.log("Login with Google clicked");
  };

  const handleLoginWApple = () => {
    console.log("Login with Apple clicked");
  };

  // Handle forgot password flow
  const handleForgotSubmit = (email) => {
    console.log("Email sent:", email);
    setIsForgotOpen(false);
    setIsCodeOpen(true); // Open verification code modal
  };

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
              <p onClick={() => setIsForgotOpen(true)}>Esqueceu a senha?</p>
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
                  validate: (value) => {
                    if (!validatePhone(value)) {
                      return "Telefone inválido. Use formato: (00) 00000-0000";
                    }
                    return true;
                  },
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
                  validate: (value) => {
                    if (!validateCPF(value)) {
                      return "CPF inválido. Verifique os dígitos informados.";
                    }
                    return true;
                  },
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
                  validate: (value) => {
                    if (!validateCNPJ(value)) {
                      return "CNPJ inválido. Verifique os dígitos informados.";
                    }
                    return true;
                  },
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
        isOpen={isAuthenticatorOpen}
        onClose={() => setIsAuthenticatorOpen(false)}
      />

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onSuccess={handleForgotSubmit}
      />

      <CodeVerificationModal
        isOpen={isCodeOpen}
        onClose={() => setIsCodeOpen(false)}
        email={loginEmail}
        onSuccess={() => {
          setIsCodeOpen(false);
          setIsPasswordOpen(true);
        }}
      />
      
      <ChangePasswordModal 
        isOpen={isPasswordOpen} 
        onClose={() => setIsPasswordOpen(false)}
      />
    </div>
  );
};

export default Auth;
