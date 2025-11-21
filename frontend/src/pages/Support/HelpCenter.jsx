import { BookOpen, MessageCircle } from 'lucide-react';

import Button from '../../components/Button/Button';

import "./HelpCenter.css"
import "../commonStyle.css"

const HelpCenter = () => {

    const handleClick = () => {
        console.log("Fui clicado :D")
    }

    return (
        <div className="support-container-wrapper">
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