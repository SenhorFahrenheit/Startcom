// Libs
import { toast } from "react-toastify";

// Hooks
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

// Components
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

// CSS
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [type, setType] = useState("cpf");

  // Modals
  const [isAuthenticatorOpen, setIsAuthenticatorOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // Login credentials
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);

  const { register, handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    console.log("Register:", data);
    
    toast.success("Cadastro realizado com sucesso!", { position: "top-center", containerId: "toast-root", });
  };

  const onError = (errors) => {
    Object.values(errors).forEach((err) =>
      toast.error(err.message, { theme: "light", containerId: "toast-root", })
    );
  };

  // Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Preencha e-mail e senha para entrar.", { position: "top-center", containerId: "toast-root",});
      return;
    }
    console.log("Login:", { loginEmail, loginPassword, keepLogged });
    toast.success("Login realizado!", { position: "top-center", containerId: "toast-root",
    });
  };

  const handleLoginWGoogle = () => {
    console.log("I was clicked - Google");
  };

  const handleLoginWApple = () => {
    console.log("I was clicked - Apple");
  };

  const handleForgotSubmit = (email) => {
    console.log("Email sended:", email);
    setIsForgotOpen(false);
    setIsCodeOpen(true);
  };

  return (
    <div className="page-wrapper">
      <div className={`container ${isLogin ? "login-mode" : ""}`}>
        <div className="form-container login">
          <h2>Login</h2>
          <form onSubmit={handleLogin} className="items-block">
            <Input type="email" placeholder="E-mail" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}/>
            <Input type="password" placeholder="Senha" icon={<RiLockPasswordFill />} iconPosition="left" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/>

            <div className="forgot-password">
              <p onClick={() => setIsForgotOpen(true)}>Esqueceu a senha?</p>
            </div>

            <div className="buttons-row">
              <ButtonLogin onClick={handleLoginWGoogle} type="button" icon={<FcGoogle />} iconPosition="right">
                Entrar com Google
              </ButtonLogin>

              <ButtonLogin onClick={handleLoginWApple} type="button" icon={<FaApple />} iconPosition="right">
                Entrar com Apple
              </ButtonLogin>
            </div>

            <div className="maintain-logged">
              <label>
                <input type="checkbox" checked={keepLogged} onChange={(e) => setKeepLogged(e.target.checked)}/>
                Manter-me conectado por 30 dias
              </label>
            </div>

            <Button label="ENTRAR" type="submit" />
          </form>
        </div>

        <div className="form-container register">
          <h2>Cadastre-se</h2>
          <form className="form-register" onSubmit={handleSubmit(onSubmit, onError)}>
            <Input
              {...register("name", { required: "Nome é obrigatório" })}
              type="text"
              placeholder="Nome"
            />

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
                rules={{ required: "Telefone é obrigatório" }}
                render={({ field }) => (
                  <Input placeholder="(00) 00000-0000" {...field} />
                )}
              />
            </div>

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

            {type === "cpf" && (
              <Controller
                name="cpf"
                control={control}
                defaultValue=""
                rules={{ required: "CPF é obrigatório" }}
                render={({ field }) => (
                  <Input placeholder="000.000.000-00" {...field} />
                )}
              />
            )}

            {type === "cnpj" && (
              <Controller
                name="cnpj"
                control={control}
                defaultValue=""
                rules={{ required: "CNPJ é obrigatório" }}
                render={({ field }) => (
                  <Input placeholder="00.000.000/0000-00" {...field} />
                )}
              />
            )}

            <Input
              {...register("email", { required: "Email é obrigatório" })}
              type="email"
              placeholder="E-mail"
            />

            <div className="inputs-row">
              <Input
                {...register("password", { required: "Senha é obrigatória" })}
                icon={<RiLockPasswordFill />}
                type="password"
                placeholder="Senha"
                iconPosition="left"
              />
              <Input
                {...register("confirmPassword", {
                  required: "Confirmar a senha é obrigatório",
                })}
                type="password"
                placeholder="Confirmar Senha"
              />
            </div>

            <Button  label="CADASTRAR" type="submit"/>
          </form>
        </div>

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

      {/* Modals */}
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
