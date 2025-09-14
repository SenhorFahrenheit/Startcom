import Button from '../../components/Button/Button'
import Header from '../../layouts/Header/Header'
import { FaArrowRight } from "react-icons/fa";

import "./Home.css"

const Home = () => {
  return (
    <>
        <Header/>

        <div className='first-container'>
          <h1 className='title-page'>Transforme seu <span>negócio</span> com a StartCom</h1>
          <p className='description-page'>A plataforma completa para pequenos e médios empreendedores gerenciarem vendas, clientes, estoque e muito mais em um só lugar.</p>
        
          <div className='two-buttons'>
            <Button fontSize={"1.05rem"} width={"250px"} height={"44px"} label={<>Acessar Dashboard <FaArrowRight /></>}/>
            <button className='about-button'>Saiba Mais</button>
          </div>
        </div>
    </>
  )
}

export default Home