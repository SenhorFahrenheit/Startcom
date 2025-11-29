import "./Footer.css";
import { NavLink } from "react-router-dom";

// Footer component with navigation links and company info
const Footer = () => {
  // Current year for copyright
  const year = new Date().getFullYear();

  return (
    <footer>
      {/* Main footer content */}
      <div className="line-footer">
        {/* Company info */}
        <div>
          <h2>StartCom</h2>
          <p className="footer-description">
            A plataforma completa para pequenos e médios empreendedores crescerem de forma inteligente e sustentável.
          </p>
        </div>

        {/* Resources section */}
        <section className="resources">
          <h3>Recursos</h3>
          <ul className="list-footer">
            <li><NavLink to="/vendas">Vendas</NavLink></li>
            <li><NavLink to="/clientes">Clientes</NavLink></li>
            <li><NavLink to="/estoque">Estoque</NavLink></li>
            <li><NavLink to="/relatorios">Relatórios</NavLink></li>
          </ul>
        </section>

        {/* Support section */}
        <section className="contact">
          <h3>Suporte</h3>
          <ul className="list-footer">
            <li><NavLink to="/ajuda">Central de Ajuda</NavLink></li>
            <li><NavLink to="/contato">Contato</NavLink></li>
            <li><NavLink to="/whatsapp">WhatsApp</NavLink></li>
            <li><NavLink to="/privacidade">Privacidade</NavLink></li>
          </ul>
        </section>
      </div>

      {/* Decorative bottom line */}
      <div className="bottom-line-footer"></div>

      {/* Copyright notice */}
      <p className="copyright">
        © {year} StartCom. Todos os direitos reservados. Transformando pequenos negócios em grandes sucessos.
      </p>
    </footer>
  );
};

export default Footer;