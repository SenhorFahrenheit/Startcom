import Button from '../../components/Button/Button'
import Header from '../../layouts/Header/Header'
import ResourceCard from '../../components/ResourceCard/ResourceCard';

// Icons
import { FaArrowRight } from "react-icons/fa";

import { GoPeople } from 'react-icons/go';
import { FiShoppingCart } from 'react-icons/fi';
import { BsBoxSeam } from 'react-icons/bs';
import { FaRegChartBar } from 'react-icons/fa';

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

        <div className='second-container'>
          <h2 className='subtitle-page'>Tudo que você precisa em uma plataforma</h2>
          <p className='subtitle-description-page'>Ferramentas poderosas e intuitivas para levar seu negócio ao próximo nível</p>
          
          <div className='resource-cards'>
            <ResourceCard icon={<FiShoppingCart/>} title={"Controle de Vendas"} description={"Gerencie suas vendas de forma simples e eficiente com relatórios em tempo real."}/>
            <ResourceCard icon={<GoPeople/>} title={"Cadastro de Clientes"} description={"Mantenha todos os dados dos seus clientes organizados e sempre acessíveis."}/>
            <ResourceCard icon={<BsBoxSeam/>} title={"Gestão de Estoque"} description={"Controle seu estoque com precisão e receba alertas de produtos em baixa."}/>
            <ResourceCard icon={<FaRegChartBar/>} title={"Relatórios Inteligentes"} description={"Visualize o desempenho do seu negócio com gráficos e métricas detalhadas."}/>
          </div>
        </div>
    </>
  )
}

export default Home