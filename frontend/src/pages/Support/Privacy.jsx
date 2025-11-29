// Styles & Icons
import "./Privacy.css";
import { Shield } from "lucide-react";

// Components
import BackHome from '../../components/BackHome/BackHome';

const Privacy = () => {
  return (
    <div className="support-container-wrapper">
      {/* Botão para voltar à página inicial */}
      <BackHome />

      <div className="privacy-container">
        {/* Ícone de privacidade */}
        <div className="icon-privacy">
          <Shield size={"40px"} />
        </div>

        {/* Título principal */}
        <h1 className="support-title">Política de Privacidade</h1>
        <p className="privacy-description">Última atualização: Novembro de 2025</p>

        {/* Seções da política */}
        <div>
          <h2 className="privacy-category-title">Seus dados estão seguros</h2>
          <p className="privacy-category-description">
            A StartCom está comprometida em proteger sua privacidade. 
            Utilizamos tecnologias avançadas de segurança e criptografia para garantir a proteção de suas informações.
          </p>
        </div>

        <div>
          <h2 className="privacy-category-title">Conformidade LGPD</h2>
          <p className="privacy-category-description">
            Estamos em total conformidade com a Lei Geral de Proteção de Dados (LGPD). 
            Você tem total controle sobre seus dados e pode solicitar acesso, correção ou exclusão a qualquer momento.
          </p>
        </div>

        <div>
          <h2 className="privacy-category-title">Uso das informações</h2>
          <p className="privacy-category-description">
            Coletamos apenas as informações necessárias para fornecer nossos serviços. 
            Seus dados não são vendidos ou compartilhados com terceiros para fins de marketing.
          </p>
        </div>

        {/* Contato para dúvidas */}
        <div className="privacy-questions">
          <p className="privacy-method-title">
            <span>Dúvidas sobre privacidade?</span>
          </p>

          <p className="privacy-method-description">
            <strong>Entre em contato:</strong> StartComLTDA@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;