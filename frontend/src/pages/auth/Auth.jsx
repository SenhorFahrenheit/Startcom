// Hooks
import { useState } from "react";
import { useForm } from "react-hook-form";

// Components
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import ForgotPasswordModal from "../../components/ForgotPassword/ForgotPasswordModal";

// Icons
import { RiLockPasswordFill } from 'react-icons/ri';

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

  return (
    <div className="page-wrapper">
      <form onSubmit={handleSubmit(onSubmit)} className={`container ${isLogin ? "login-mode" : ""}`}>

        <div className="form-container login">
          <h2>Login</h2>
          <Input placeholder="E-mail" value={email}/>
          <Input placeholder="Senha" icon={<RiLockPasswordFill/>} iconPosition="left"  value={password}/>
      
          <div className="forgot-password">
            <p onClick={() => setModalIsOpen(true)}>Esqueceu a senha?</p>
          </div>  

          <ForgotPasswordModal
            isOpen={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
          />

          <div className="login-with">
            <button>Entrar com Google</button>
            <button>Entrar com Apple</button>
          </div>
          <Button label="ENTRAR" onClick={handleSubmit} type="submit" />
        </div>

        <div className="form-container cadastro">
          <h2>Cadastre-se</h2>
          <input placeholder="Nome" />
          
          <div>
            <div className="date-input-wrapper">
                <input type="date" id="birthdate" />
                <label htmlFor="birthdate">Nascimento</label>
                <span className="calendar-icon">📅</span>
            </div>

            <div className="input-with-icon">
                <input type="tel" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" placeholder="Telefone"/>
                <span className="icon"></span>
            </div>
          </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button type="button" onClick={() => setType("cpf")}>CPF</button>
            <button type="button" onClick={() => setType("cnpj")}>CNPJ</button>
        </div>

        {type === "cpf" && (
            <div>
                <input
                    {...register("cpf", {
                    pattern: {
                        value: /^\d{3}\.\d{3}\.\d{3}\d{2}$/,
                        message: "CPF inválido"
                    }
                    })}
                    placeholder="000.000.000-00"/>
                {errors.cpf && <p>{errors.cpf.message}</p>}
            </div>
        )}

        {type === "cnpj" && (
            <div>
                <input
                    {...register("cnpj", {
                    pattern: {
                        value: /^\d{2}\.\d{3}\.\d{3}\/\d{4}\d{2}$/,
                        message: "CNPJ inválido"
                    }
                    })}
                    placeholder="00.000.000/0000-00"
                    
                />
                {errors.cnpj && <p>{errors.cnpj.message}</p>}
            </div>
        )}
            <input type="email" placeholder="E-mail" />

            <div>
                <div className="input-with-icon">
                    <input type="text" placeholder="Usuário" />
                    <span className="icon">👤</span>
                </div>
                <input type="password" placeholder="Confirmar senha" />
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
