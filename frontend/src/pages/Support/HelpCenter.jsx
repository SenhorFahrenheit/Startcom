import { BookOpen, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/Button/Button';
import BackHome from '../../components/BackHome/BackHome';

import "./HelpCenter.css"
import "../commonStyle.css"

const HelpCenter = () => {

    const navigate = useNavigate()

    const handleClick = () => {
        navigate("/contato")
    }

    return (
        <div className="support-container-wrapper">
            <BackHome/>
            <div className="help-container">
                <div className="icon-help">
                    <BookOpen size={"40px"}/>
                </div>
                
                <h1 className="support-title">Central de Ajuda</h1>
                <p className="help-subtitle">Precisa de ajuda? Estamos aqui para você!</p>

                <Button
                    onClick={handleClick}
                    height="50px"
                    width={"90%"}
                    fontSize="1.05rem"
                    label={<><MessageCircle size={"1.25rem"} />Falar com Suporte</>}
                />

                <p className="help-description">Nossa equipe responde em até 24 horas</p>
            </div>
        </div>
    )
}

export default HelpCenter