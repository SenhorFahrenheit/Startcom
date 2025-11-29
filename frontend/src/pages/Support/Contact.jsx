// Libraries & Styles
import "./Contact.css";
import "../commonStyle.css";
import { Mail, Send } from "lucide-react";
import { toast } from "react-toastify";

// Components
import BackHome from "../../components/BackHome/BackHome";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

// Hooks & Services
import { useContactForm } from "../../hooks/useContactForm";
import api from "../../services/api";

const Contact = () => {
  // Form hook
  const { register, handleSubmit, onSubmit, onError } = useContactForm();

  // Handles submission to backend
  const handleMessageSubmit = async (data) => {
    try {
      const response = await api.post("/User/contact/", data);
      console.log(response, data);

      if (response.status === 200) {
        toast.success("Mensagem enviada com sucesso!", {
          position: "top-right",
          containerId: "toast-root",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Falha ao enviar a mensagem. Tente novamente mais tarde.", {
        position: "top-right",
        containerId: "toast-root",
      });
    }
  };

  return (
    <div className="support-container-wrapper">
      {/* Back navigation */}
      <BackHome />

      <div className="contact-container">
        {/* Icon */}
        <div className="icon-contact">
          <Mail size={"40px"} />
        </div>

        {/* Page title */}
        <h1 className="support-title">Entre em Contato</h1>
        <p className="contact-subtitle">
          Envie sua mensagem e responderemos em breve
        </p>

        {/* Contact form */}
        <form
          className="contact-form"
          style={{ width: "100%" }}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          {/* Name input */}
          <Input
            type="text"
            placeholder="Seu Nome"
            style={{
              height: "50px",
              borderRadius: "var(--border-radius)",
              margin: "20px 0 5px",
              width: "90%",
              backgroundColor: "transparent",
              border: "1px solid #e1ddddff",
            }}
            {...register("name", { required: "O nome é obrigatório." })}
          />

          {/* Email input */}
          <Input
            type="email"
            placeholder="Seu e-mail"
            style={{
              height: "50px",
              borderRadius: "var(--border-radius)",
              margin: "5px 0",
              width: "90%",
              backgroundColor: "transparent",
              border: "1px solid #e1ddddff",
            }}
            {...register("email", {
              required: "O e-mail é obrigatório.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "E-mail inválido.",
              },
            })}
          />

          {/* Message textarea */}
          <textarea
            placeholder="Sua Mensagem..."
            rows="6"
            className="contact-message"
            style={{
              margin: "5px 0 10px",
              width: "90%",
              border: "1px solid #e1ddddff",
              borderRadius: "var(--border-radius)",
            }}
            {...register("message", { required: "A mensagem não pode estar vazia." })}
          />

          {/* Submit button */}
          <Button
            onSubmit={handleSubmit(handleMessageSubmit, onError)}
            type="submit"
            height="50px"
            width="90%"
            fontSize="1.05rem"
            label={
              <>
                <Send size={"1.25rem"} />
                Falar com Suporte
              </>
            }
          />
        </form>

        {/* Contact info */}
        <p className="contact-method">
          <span>E-mail: </span>StartComLTDA@gmail.com
        </p>
        <p className="contact-method">
          <span>Telefone: </span>+55 (13) 99655-0868
        </p>
      </div>
    </div>
  );
};

export default Contact;