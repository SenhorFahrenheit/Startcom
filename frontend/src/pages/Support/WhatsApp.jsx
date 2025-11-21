import { MessageCircle } from 'lucide-react';

import Button from '../../components/Button/Button';
import BackHome from '../../components/BackHome/BackHome';

import "./WhatsApp.css"
import "../commonStyle.css"

const WhatsApp = () => {

    const handleClick = () => {
        const phoneNumber = "5513996550868";
        const message = encodeURIComponent("Olá! Preciso de suporte.");
        const url = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(url, "_blank");
    };

    return (
        <div className="support-container-wrapper">
            <BackHome/>
            <div className="whatsapp-container">
                <div className="icon-whatsapp">
                    <MessageCircle size={"44px"}/>
                </div>
                
                <h1 className="support-title">WhatsApp</h1>
                <p className="whatsapp-subtitle">Fale conosco diretamente pelo WhatsApp</p>

                <Button
                    buttonColor={"#25D366"}
                    onClick={handleClick}
                    height="50px"
                    width={"260px"}
                    fontSize="1.05rem"
                    label={<><MessageCircle size={"1.25rem"} />Falar com Suporte</>}
                />

                <div className="business-hour">
                    <p className="contact-method-title"><span>Horário de Atendimento</span></p>

                    <p class="contact-hours">
                        <strong>Segunda a Sexta:</strong> 9h às 18h<br/>
                        <strong>Sábado:</strong> 9h às 13h
                    </p>
                </div>
            </div>
        </div>
    )
}

export default WhatsApp