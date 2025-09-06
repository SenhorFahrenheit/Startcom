// Hooks
import { useState } from "react";
import { useForm } from "react-hook-form";

// Components
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import ButtonLogin from "../../components/ButtonLogin/ButtonLogin";
import ForgotPasswordModal from "../../components/ForgotPassword/ForgotPasswordModal";

// Icons
import { RiLockPasswordFill } from 'react-icons/ri';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

// CSS
import "./Auth.css";


const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [type, setType] = useState("cpf");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = () => {
    console.log("Essa função aqui vai fazer algo em algum momento, por enquanto tá só pra não dar erro no meu código.");
  };

  const handleLoginWGoogle = () => {
    console.log("Fui clicado Google")
  }

  const handleLoginWApple = () => {
    console.log("Fui clicado Apple")
  }
  return (
    <div className="page-wrapper">
      <form onSubmit={handleSubmit(onSubmit)} className={`container ${isLogin ? "login-mode" : ""}`}>

        <div className="form-container login">
          <h2>Login</h2>
          <Input placeholder="E-mail" value={email}/>
          <Input placeholder="Senha" icon={<RiLockPasswordFill/>} iconPosition="left" value={password}/>
      
          <div className="forgot-password">
            <p onClick={() => setModalIsOpen(true)}>Esqueceu a senha?</p>
          </div>  

          <ForgotPasswordModal
            isOpen={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
          />

          <div className="buttons-row">
            <ButtonLogin onClick={handleLoginWGoogle} type="button" icon={<FcGoogle/>} iconPosition="right">Entrar com Google</ButtonLogin>
            <ButtonLogin onClick={handleLoginWApple} type="button" icon={<FaApple/>} iconPosition="right">Entrar com Apple</ButtonLogin>
          </div>

          <Button label="ENTRAR" onClick={handleSubmit} type="submit" />
        </div>

        <div className="form-container cadastro">
          <h2>Cadastre-se</h2>
          <Input type="text" placeholder="Nome"/>
          
          
          <div className="inputs-row">
            <Input type="date" placeholder="Senha" iconPosition="right"/>
            <Input type="tel" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" placeholder="Telefone"/>
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
            <>
            <Input placeholder="000.000.000-00"/>
            </>
        )}

        {type === "cnpj" && (
          <>
            <Input placeholder="00.000.000/0000-00"/>
          </>
        )}
            <Input type="email" placeholder="E-mail"/>

            <div className="inputs-row">
              <Input icon={<RiLockPasswordFill/>} type="password" placeholder="Senha" iconPosition="left"/>
              <Input type="password" placeholder="Confirmar Senha"/>
            </div>

          <Button label="CADASTRAR" onClick={handleSubmit} type="submit"/>
        </div>

        <div className="side-panel">
          <h2>LOGO</h2>
          <p>Cadastre-se ou faça login para acessar todos os recursos!</p>
          <Button label={isLogin ? "CRIAR CONTA" : "FAZER LOGIN"} onClick={() => setIsLogin(!isLogin)} type="button" variant="quaternary"/>
        </div>

      </form>
    </div>
  );
};

export default Auth;