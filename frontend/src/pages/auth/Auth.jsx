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

// Icons
import { RiLockPasswordFill } from 'react-icons/ri';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

// CSS
import "./Auth.css";


const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [type, setType] = useState("cpf");

  // Modals
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  // Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);

  const { register, handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    toast.success("Cadastro realizado com sucesso!", {
      position: "top-center"
    });
  };

  const onError = (errors) => {
    Object.values(errors).forEach(err => toast.error(err.message, {
      theme: "light"
    }));
  };

  const handleLogin = () => {
    console.log("User is logging.")
  }
  const handleLoginWGoogle = () => {
    console.log("I was clicked - Google")
  }

  const handleLoginWApple = () => {
    console.log("I was clicked - Apple")
  }
  return (
    <div className="page-wrapper">
      <form onSubmit={handleSubmit(onSubmit, onError)} className={`container ${isLogin ? "login-mode" : ""}`}>

        <div className="form-container login">
          <h2>Login</h2>
          <div className="items-block">
            <Input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="E-mail" value={email}/>
            <Input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Senha" icon={<RiLockPasswordFill/>} iconPosition="left" value={password}/>

            <div className="forgot-password">
              <p onClick={() => setIsForgotOpen(true)}>Esqueceu a senha?</p>
            </div>  

            <div className="buttons-row">
              <ButtonLogin onClick={handleLoginWGoogle} type="button" icon={<FcGoogle/>} iconPosition="right">Entrar com Google</ButtonLogin>
              <ButtonLogin onClick={handleLoginWApple} type="button" icon={<FaApple/>} iconPosition="right">Entrar com Apple</ButtonLogin>
            </div>
            <div className="maintain-logged">
              <label>
                <input type="checkbox" onChange={(e) => setKeepLogged(e.target.value)}/>
                Manter-me conectado por 30 dias
              </label>
            </div>
          </div>

          <Button label="ENTRAR" onClick={() => handleLogin} type="submit" />
        </div>

        <div className="form-container cadastro">
          <h2>Cadastre-se</h2>
          <Input {...register("name", { required: "Nome é obrigatório" })} type="text" placeholder="Nome"/>
          
          <div className="inputs-row">
            <Input {...register("date", { required: "Data é obrigatória" })} type="date" placeholder="data" iconPosition="left"/>
            <Controller
              name="telefone"
              control={control}
              defaultValue=""
              rules={{ required: "Telefone é obrigatório" }}
              render={({ field }) => (
                <>
                  <Input
                    placeholder="(00) 00000-0000"
                    {...field} // value and onChange
                  />
                </>
              )}/>
          </div>

          <div className="CPF-or-CNPJ">
            <button className={`CPF ${type === "cpf" ? "active" : ""}`} type="button" onClick={() => setType("cpf")}>
              CPF
            </button>
            <button className={`CNPJ ${type === "cnpj" ? "active" : ""}`} type="button" onClick={() => setType("cnpj")}>
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
                <>
                  <Input
                    placeholder="000.000.000-00"
                    {...field} // value and onChange
                  />
                </>
              )}/>
        )}

        {type === "cnpj" && (
          <Controller
            name="cnpj"
            control={control}
            defaultValue=""
            rules={{ required: "CNPJ é obrigatório" }}
            render={({ field }) => (
              <>
                <Input
                  placeholder="00.000.000/0000-00"
                  {...field} // value and onChange
                />
              </>
          )}/>
        )}
            <Input {...register("email", {required: "Email é obrigatório"})} type="email" placeholder="E-mail"/>

            <div className="inputs-row">
              <Input {...register("password", {required: "Senha é obrigatória"})} icon={<RiLockPasswordFill/>} type="password" placeholder="Senha" iconPosition="left"/>
              <Input {...register("confirmPassword", {required: "Confirmar a senha é obrigatório"})}type="password" placeholder="Confirmar Senha"/>
            </div>

          <Button label="CADASTRAR" onClick={handleSubmit} type="submit"/>
        </div>

        <div className="side-panel">
          <h2>LOGO</h2>
          <p className="login-or-signin-text">Cadastre-se ou faça login para acessar todos os recursos!</p>
          <Button label={isLogin ? "CRIAR CONTA" : "FAZER LOGIN"} onClick={() => setIsLogin(!isLogin)} type="button" variant="quaternary"/>
        </div>
      </form>

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </div>
  );
};

export default Auth;