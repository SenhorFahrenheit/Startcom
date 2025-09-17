import { NavLink } from "react-router-dom"

import Button from "../../components/Button/Button"
import "./Header.css"
 
const Header = () => {
  return (
    <header>
        <h2>StartCom</h2>
 
        <nav className="navigation">
            <a href="">Recursos</a>
            <a href="">Depoimentos</a>
            <a href="">Contato</a>
        </nav>
 
        <Button height={"40px"} width={"100px"} label={<NavLink className="link-inside-button" to="/login">Cadastrar</NavLink>} type='button' />
    </header>
  )
}
 
export default Header