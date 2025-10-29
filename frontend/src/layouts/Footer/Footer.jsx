import "./Footer.css"
import { NavLink } from "react-router-dom"

const Footer = () => {

    const year = new Date().getFullYear();

  return (
    <footer>
        <div className="line-footer">
            <div>
                <h2>StartCom</h2>
                <p className="footer-description">A plataforma completa para pequenos e médios empreendedores crescerem de forma inteligente e sustentável.</p>
            </div>

            <section className="resources">
                <h3>Recursos</h3>

                <ul className="list-footer">
                    <li><NavLink to="/vendas">Vendas</NavLink></li>
                    <li><NavLink to="/clientes">Clientes</NavLink></li>
                    <li><NavLink to="/estoque">Estoque</NavLink></li>
                    <li><NavLink to="/relatorios">Relatórios</NavLink></li>
                </ul>
            </section>

            <section className="contact">
                <h3>Suporte</h3>

                <ul className="list-footer">
                    <li><NavLink to="/">Central de Ajuda</NavLink></li>
                    <li><NavLink to="/">Contato</NavLink></li>
                    <li><NavLink to="/">WhatsApp</NavLink></li>
                    <li><NavLink to="/">Privacidade</NavLink></li>
                </ul>
            </section>
        </div>

        <div className="bottom-line-footer"></div>

        <p className="copyright">© {year} StartCom. Todos os direitos reservados. Transformando pequenos negócios em grandes sucessos.</p>
    </footer>
  )
}

export default Footer