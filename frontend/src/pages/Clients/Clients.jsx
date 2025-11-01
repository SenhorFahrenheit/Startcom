import "./Clients.css";
import "../commonStyle.css";

import formatCurrency from '../../utils/format';

import Sidebar from "../../layouts/Sidebar/Sidebar";
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile";
import Button from "../../components/Button/Button";

import NewClientModal from "../../components/Modals/NewClientModal";
import ClientInformationCard from "../../components/ClientInformationCard/ClientInformationCard";
import ClientCard from "../../components/ClientCard/ClientCard";
import FilterSelect from "../../components/FilterSelect/FilterSelect";

import { useState, useEffect } from "react";
import { useAuthModals } from "../../hooks/useAuthModals";
import axios from "axios";

import { LuPlus, LuSmile, LuUsers, LuStar, LuCalendar } from "react-icons/lu";

const Clients = () => {
  const { activeModal, openClient, closeModal } = useAuthModals();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [overview, setOverview] = useState({
    clients: {
      total: 0,
      vip: 0,
      newThisMonth: 0,
      averageSatisfaction: 0,
    }
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverviewAndClients = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/Company/clients/overview_full", {
        companyId: "69019f25b407b09e0d09cff5"
      });

      const data = response.data;

      if (data.status === "success") {
        setOverview(data.overview);

        const formattedClients = (data.clients || []).map(c => ({
          clientName: c.name,
          clientType: c.category ? c.category[0].toUpperCase() + c.category.slice(1) : "Regular",
          email: c.email || "Não Informado",
          phoneNumber: c.phone || "Não Informado",
          city: c.address || "Não Informado",
          totalSpent: c.totalSpent || "Não Informado",
          lastPurchase: c.lastPurchase || "Não Informado",
        }));

        setClients(formattedClients);
      } else {
        throw new Error("Resposta inválida da API");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewAndClients();
  }, []);

  const filteredClients = clients.filter(c => {
    return (
      c.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phoneNumber?.includes(search)
    );
  });

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <section className="body-section">
      <HeaderMobile onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      <div className="content-page-section">
        <div className="align-heading">
          <div>
            <h1 className="title-page-section">Clientes</h1>
            <p className="description-page-section">
              Gerencie sua base de clientes e relacionamentos
            </p>
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
          {loading ? (
            <p>Carregando dados...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <>
              <ClientCard icon={<LuUsers size={24}/>} value={overview.clients.total} description="Total de Clientes" color="blue"/>
              <ClientCard icon={<LuStar size={24}/>} value={overview.clients.vip} description="Clientes VIP" color="purple"/>
              <ClientCard icon={<LuCalendar size={24}/>} value={overview.clients.newThisMonth} description="Novos este mês" color="orange"/>
              <ClientCard icon={<LuSmile size={24}/>} value={overview.clients.averageSatisfaction.toFixed(1)} description="Satisfação Média" color="green"/>
            </>
          )}
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
            <p className="nothing-was-found" style={{marginTop: 20}}>
              Nenhum cliente encontrado.
            </p>
          )}
        </div>
      </div>

      <NewClientModal
        isOpen={activeModal === "client"}
        onClose={closeModal}
        onSuccess={(newClientFromAPI) => {
          const clientFormatted = {
            clientName: newClientFromAPI.name,
            clientType: newClientFromAPI.category 
              ? newClientFromAPI.category[0].toUpperCase() + newClientFromAPI.category.slice(1)
              : "Regular",
            email: newClientFromAPI.email,
            phoneNumber: newClientFromAPI.phone,
            city: newClientFromAPI.address || "Não Informado",
            totalSpent: "0",
            lastPurchase: "Não há",
          };

          setClients(prevClients => [clientFormatted, ...prevClients]);

          fetchOverviewAndClients();
        }}
      />
    </section>
  )
}

export default Clients;
