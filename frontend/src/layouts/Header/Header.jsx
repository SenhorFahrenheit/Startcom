import Button from "../../components/Button/Button"
import "./Header.css"
 
const Header = () => {
  return (
    <header>
        <img src="" alt="" />
 
        <nav>
            <a href="">Recursos</a>
            <a href="">Depoimentos</a>
            <a href="">Contato</a>
        </nav>
 
        <Button height={"40px"} width={"100px"} label='Dashboard' type='button' />
    </header>
  )
}
 
export default Header