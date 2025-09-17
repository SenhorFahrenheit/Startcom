// Layouts
import Header from '../../layouts/Header/Header'
import Footer from '../../layouts/Footer/Footer';

// Components
import Button from '../../components/Button/Button'
import ResourceCard from '../../components/ResourceCard/ResourceCard';
import ReviewCard from '../../components/ReviewCard/ReviewCard';

// Icons
import { FaArrowRight } from "react-icons/fa";
import { GoPeople } from 'react-icons/go';
import { FiShoppingCart } from 'react-icons/fi';
import { BsBoxSeam } from 'react-icons/bs';
import { FaRegChartBar } from 'react-icons/fa';

import { NavLink } from 'react-router-dom';

import "./Home.css"

const Home = () => {
  return (
    <>
        <Header/>

        <div className='first-container'>
          <h1 className='title-page'>Transforme seu <span>negócio</span> com a StartCom</h1>
          <p className='description-page'>A plataforma completa para pequenos e médios empreendedores gerenciarem vendas, clientes, estoque e muito mais em um só lugar.</p>
        
          <div className='two-buttons'>
            <Button fontSize={"1.05rem"} width={"250px"} height={"44px"} label={<NavLink className="link-to-dashboard" to="/dashboard">Acessar Dashboard <FaArrowRight /></NavLink>}/>      
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

        <div className='third-container'>
          <h2 className='subtitle-page'>O que nossos clientes dizem</h2>
          <p className='subtitle-description-page'>Histórias reais de empreendedores que transformaram seus negócios</p>
          <div className='review-cards'>
            <ReviewCard rating={5} name={"Maria Silva"} business={"Loja de Roupas Femininas"} comment={"Com a StartCom, consegui aumentar minhas vendas em 40% no primeiro trimestre!"}/>
            <ReviewCard rating={5} name={"João Santos"} business={"Mercadinho do Bairro"} comment={"Finalmente tenho controle total do meu estoque. Não perco mais vendas por falta de produtos."}/>
            <ReviewCard rating={4} name={"Ana Costa"} business={"Doceria Artesanal"} comment={"Os relatórios me ajudaram a identificar meus produtos mais vendidos. Recomendo!"}/>
          </div>
        </div>

        <div className='fourth-container'>
            <h2 className='subtitle-page last white'>Pronto para transformar seu negócio?</h2>
            <p className='subtitle-description-page white'>Junte-se a milhares de empreendedores que já estão usando a StartCom para crescer mais rápido.</p>
        
            <button className='access-button'>Acessar minha conta <FaArrowRight size={14}/></button>
        </div>
        
        <Footer/>
    </>
  )
}

export default Home