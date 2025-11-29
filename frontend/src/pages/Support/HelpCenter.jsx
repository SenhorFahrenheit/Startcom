// Libraries & Styles
import { BookOpen, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "./HelpCenter.css";
import "../commonStyle.css";

// Components
import Button from '../../components/Button/Button';
import BackHome from '../../components/BackHome/BackHome';

const HelpCenter = () => {
  const navigate = useNavigate();

  // Redireciona para a página de contato
  const handleClick = () => {
    navigate("/contato");
  };

  return (
    <div className="support-container-wrapper">
      {/* Botão para voltar para a página inicial */}
      <BackHome />

      <div className="help-container">
        {/* Ícone da seção */}
        <div className="icon-help">
          <BookOpen size={"40px"} />
        </div>

        {/* Título e descrição */}
        <h1 className="support-title">Central de Ajuda</h1>
        <p className="help-subtitle">Precisa de ajuda? Estamos aqui para você!</p>

        {/* Botão de contato */}
        <Button
          onClick={handleClick}
          height="50px"
          width="90%"
          fontSize="1.05rem"
          label={
            <>
              <MessageCircle size={"1.25rem"} />
              Falar com Suporte
            </>
          }
        />

        {/* Informação adicional */}
        <p className="help-description">Nossa equipe responde em até 24 horas</p>
      </div>
    </div>
  );
};

export default HelpCenter;