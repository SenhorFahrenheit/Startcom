// Layouts
import Header from '../../layouts/Header/Header' // Header layout
import Footer from '../../layouts/Footer/Footer'; // Footer layout

// Components
import Button from '../../components/Button/Button' // Reusable button
import ResourceCard from '../../components/ResourceCard/ResourceCard'; // Card for platform features
import ReviewCard from '../../components/ReviewCard/ReviewCard'; // Customer review card

// Icons
import { FaArrowRight } from "react-icons/fa"; // Arrow icon
import { GoPeople } from 'react-icons/go'; // People icon
import { FiShoppingCart } from 'react-icons/fi'; // Shopping cart icon
import { BsBoxSeam } from 'react-icons/bs'; // Box icon
import { FaRegChartBar } from 'react-icons/fa'; // Chart icon

import { NavLink } from 'react-router-dom'; // Routing links

import "./Home.css" // Page-specific styles

const Home = () => {
  return (
    <>
        <Header/> {/* Main header */}

        <div className='first-container'>
          <h1 className='title-page'>Transforme seu <span>negócio</span> com a StartCom</h1> {/* Main title */}
          <p className='description-page'>A plataforma completa para pequenos e médios empreendedores gerenciarem vendas, clientes, estoque e muito mais em um só lugar.</p> {/* Description */}
        
          <div className='two-buttons'>
            <NavLink className="link-to-dashboard" to="/login">
              <button style={{width: 260}} className='access-button variant-hover'>
                Acessar minha conta <FaArrowRight size={14}/>
              </button>
            </NavLink> {/* Login button */}
          </div>
        </div>

        <div className='second-container' id="resources">
          <h2 className='subtitle-page'>Tudo que você precisa em uma plataforma</h2> {/* Section title */}
          <p className='subtitle-description-page'>Ferramentas poderosas e intuitivas para levar seu negócio ao próximo nível</p> {/* Section description */}
          
          <div className='resource-cards'>
            {/* Platform feature cards */}
            <ResourceCard icon={<FiShoppingCart/>} title={"Controle de Vendas"} description={"Gerencie suas vendas de forma simples e eficiente com relatórios em tempo real."}/>
            <ResourceCard icon={<GoPeople/>} title={"Cadastro de Clientes"} description={"Mantenha todos os dados dos seus clientes organizados e sempre acessíveis."}/>
            <ResourceCard icon={<BsBoxSeam/>} title={"Gestão de Estoque"} description={"Controle seu estoque com precisão e receba alertas de produtos em baixa."}/>
            <ResourceCard icon={<FaRegChartBar/>} title={"Relatórios Inteligentes"} description={"Visualize o desempenho do seu negócio com gráficos e métricas detalhadas."}/>
          </div>
        </div>

        <div className='third-container' id="reviews">
          <h2 className='subtitle-page'>O que nossos clientes dizem</h2> {/* Customer reviews section */}
          <p className='subtitle-description-page'>Histórias reais de empreendedores que transformaram seus negócios</p> {/* Section description */}
          
          <div className='review-cards'>
            {/* Customer review cards */}
            <ReviewCard rating={5} name={"Maria Silva"} business={"Loja de Roupas Femininas"} comment={"Com a StartCom, consegui aumentar minhas vendas em 40% no primeiro trimestre!"}/>
            <ReviewCard rating={5} name={"João Santos"} business={"Mercadinho do Bairro"} comment={"Finalmente tenho controle total do meu estoque. Não perco mais vendas por falta de produtos."}/>
            <ReviewCard rating={4} name={"Ana Costa"} business={"Doceria Artesanal"} comment={"Os relatórios me ajudaram a identificar meus produtos mais vendidos. Recomendo!"}/>
          </div>
        </div>

        <div className='fourth-container'>
            <h2 className='subtitle-page last white'>Pronto para transformar seu negócio?</h2> {/* Call-to-action title */}
            <p className='subtitle-description-page white'>Junte-se a milhares de empreendedores que já estão usando a StartCom para crescer mais rápido.</p> {/* Call-to-action description */}
            
            <NavLink className="link-to-dashboard" to="/painel">
              <button className='access-button'>Acessar Dashboard <FaArrowRight size={14}/></button>
            </NavLink> {/* Dashboard access button */}
        </div>
        
        <Footer/> {/* Main footer */}
    </>
  )
}

export default Home // Export home page component