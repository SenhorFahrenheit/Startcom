import "./Footer.css"

const Footer = () => {
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
                    <li><a href="">Vendas</a></li>
                    <li><a href="">Clientes</a></li>
                    <li><a href="">Estoque</a></li>
                    <li><a href="">Relatórios</a></li>
                </ul>
            </section>

            <section className="contact">
                <h3>Suporte</h3>

                <ul className="list-footer">
                    <li><a href="">Central de Ajuda</a></li>
                    <li><a href="">Contato</a></li>
                    <li><a href="">WhatsApp</a></li>
                    <li><a href="">Privacidade</a></li>
                </ul>
            </section>
        </div>

        <div className="bottom-line-footer"></div>

        <p className="copyright">© 2024 StartCom. Todos os direitos reservados. Transformando pequenos negócios em grandes sucessos.</p>
    </footer>
  )
}

export default Footer