import "./Clients.css"
import "../commonStyle.css"

import formatCurrency from '../../utils/format';

import Sidebar from "../../layouts/Sidebar/Sidebar"
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile";
import Button from "../../components/Button/Button";

import NewClientModal from "../../components/Modals/NewClientModal";
import ClientInformationCard from "../../components/ClientInformationCard/ClientInformationCard";
import ClientCard from "../../components/ClientCard/ClientCard";
import FilterSelect from "../../components/FilterSelect/FilterSelect";

import { useState } from "react";
import { useAuthModals } from "../../hooks/useAuthModals"

import { LuPlus, LuSmile, LuUsers, LuStar, LuCalendar } from "react-icons/lu";

const Clients = () => {
  const { activeModal, openClient, closeModal } = useAuthModals();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const clients = [
    {
      clientName: "Carlos Soares Silva",
      clientType: "VIP",
      email: "carlos@email.com",
      phoneNumber: "(11) 99999-9999",
      city: "São Paulo",
      totalSpent: "1256.80",
      lastPurchase: "14/04/2025"
    },
    {
      clientName: "João Santos",
      clientType: "Regular",
      email: "joao@email.com",
      phoneNumber: "(11) 88888-8888",
      city: "Rio de Janeiro",
      totalSpent: "845.30",
      lastPurchase: "11/07/2025"
    },
    {
      clientName: "Pedro Henrique Pinheiro",
      clientType: "Premium",
      email: "pedro@email.com",
      phoneNumber: "(11) 77777-7777",
      city: "Belo Horizonte",
      totalSpent: "2340.50",
      lastPurchase: "09/09/2025"
    }
  ];

  const filteredClients = clients.filter(c => {
    const matchesSearch =
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phoneNumber.includes(search);

    const matchesType =
      typeFilter === "all" || c.clientType.toLowerCase() === typeFilter;

    return matchesSearch && matchesType;
  });
  
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
              <h1 className="title-page-section">Clientes</h1>
              <p className="description-page-section">Gerencie sua base de clientes e relacionamentos</p>
            </div>
            <div className="button-shadown">
              <Button 
                className="hover-dashboard" 
                onClick={openClient} 
                height={"auto"} 
                width={160} 
                label={<><LuPlus size={"1.5rem"}/>Novo Cliente</>} 
              />
            </div>
          </div>

          <section className="clientCards">
            <ClientCard icon={<LuUsers size={24}/>} value="156" description="Total de Clientes" color="blue"/>
            <ClientCard icon={<LuStar size={24}/>} value="23" description="Clientes VIP" color="purple"/>
            <ClientCard icon={<LuCalendar size={24}/>} value="12" description="Novos este mês" color="orange"/>
            <ClientCard icon={<LuSmile size={24}/>} value="4,8" description="Satisfação Média" color="green"/>
          </section>

          <div className="filter-search">
            <input 
              style={{ fontSize: 14, paddingLeft: 16 }} 
              className="InputDashboard" 
              type="text" 
              placeholder="Buscar por nome, email, telefone..." 
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filters-block">
              <FilterSelect
                label="Filtrar por tipo"
                options={[
                  { label: "Todos", value: "all" },
                  { label: "VIP", value: "vip" },
                  { label: "Premium", value: "premium" },
                  { label: "Regular", value: "regular" },
                ]}
                defaultValue="Todos"
                onSelect={(val) => setTypeFilter(val)}
              />
            </div>
          </div>    

          <div className="clientInformationCards">
            {filteredClients.length > 0 ? (
            filteredClients.map((c, idx) => (
              <ClientInformationCard 
                key={idx}
                clientName={c.clientName}
                clientType={c.clientType}
                email={c.email}
                phoneNumber={c.phoneNumber}
                city={c.city}
                totalSpent={formatCurrency(c.totalSpent)}
                lastPurchase={c.lastPurchase}
              />
            ))
          ) : (
            <p className="nothing-was-found" style={{marginTop: 20}}>Nenhum cliente encontrado.</p>
          )}

          </div>

        </div>

      <NewClientModal
        isOpen={activeModal === "client"}
        onClose={closeModal}
      />
    </section>
  )
}

export default Clients