import "../commonStyle.css"
import "./Inventory.css"

import Sidebar from "../../layouts/Sidebar/Sidebar"
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile"
import Button from "../../components/Button/Button"
import NewProductModal from "../../components/Modals/NewProductModal"

import FilterSelect from "../../components/FilterSelect/FilterSelect"

import { LuPlus, LuBox, LuTrendingDown, LuTriangleAlert, LuPackage } from "react-icons/lu"

import { useAuthModals } from "../../hooks/useAuthModals"

import { useState } from "react"
import ProductCard from "../../components/ProductCard/ProductCard"

const Inventory = () => {

  const { activeModal, openProduct, closeModal } = useAuthModals();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  }

  return (
    <section className="body-section">
        <HeaderMobile onToggleSidebar={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

        <div className="content-page-section">
          <div className="align-heading">
              <div>
                <h1 className="title-page-section">Estoque</h1>
                <p className="description-page-section">Controle completo do seu inventário</p>
              </div>
              <div className="button-shadown">
                <Button 
                  className="hover-dashboard" 
                  onClick={openProduct} 
                  height={40} 
                  width={140} 
                  label={<><LuPlus size={16}/>Novo Produto</>} 
                />
            </div>
          </div>

          <div className="productCards">
            <ProductCard title="Total de Produtos" value="4" color="normal" icon={<LuBox size={20}/>}/>
            <ProductCard title="Estoque Baixo" value="2" extra="Atenção necessária" color="warning" icon={<LuTrendingDown size={20}/>}/>
            <ProductCard title="Crítico" value="0" extra="Reposição urgente" color="alert" icon={<LuTriangleAlert size={20}/>}/>
            <ProductCard title="Valor Total" value="R$ 11202.20" color="normal" icon={<LuPackage size={20}/>}/>
          </div>

          <div className="filter-search">
          <input 
            style={{ fontSize: 14, paddingLeft: 16 }} 
            className="InputDashboard" 
            type="text" 
            placeholder="Buscar produtos por nome, código..." 
          />
          <div className="filters-block">
            <FilterSelect
                label="Categoria: "
                options={[
                  { label: "Todas", value: "all" },
                  { label: "Roupas", value: "clothes" },
                  { label: "Calçados", value: "footwear" },
                  { label: "Acessórios", value: "accessories" },
                ]}
                defaultValue="Todas"
                onSelect={(val) => console.log("Categoria escolhida:", val)}
              />

            <FilterSelect
                label="Status: "
                options={[
                  { label: "Todos", value: "all" },
                  { label: "Normal", value: "normal" },
                  { label: "Baixo", value: "low" },
                  { label: "Crítico", value: "critic" },
                  { label: "Esgotado", value: "soldout" },
                ]}
                defaultValue="Todos"
                onSelect={(val) => console.log("Status escolhido:", val)}
              />
          </div>
        </div>

        </div>

        <NewProductModal
          isOpen={activeModal === "inventory"}
          onClose={closeModal}
        />
    </section>
  )
}

export default Inventory