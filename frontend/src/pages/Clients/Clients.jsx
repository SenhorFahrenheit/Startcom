import "./Clients.css";
import "../commonStyle.css";

import { formatCurrency, formatDateBR, formatPhone } from '../../utils/format';

import Sidebar from "../../layouts/Sidebar/Sidebar";
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile";
import Button from "../../components/Button/Button";

import NewClientModal from "../../components/Modals/NewClientModal";
import ClientInformationCard from "../../components/ClientInformationCard/ClientInformationCard";
import ClientCard from "../../components/ClientCard/ClientCard";
import FilterSelect from "../../components/FilterSelect/FilterSelect";

import { useState, useEffect } from "react";
import { useAuthModals } from "../../hooks/useAuthModals";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

import { LuPlus, LuSmile, LuUsers, LuStar, LuCalendar } from "react-icons/lu";

const Clients = () => {
  const { token, user, isAuthenticated, pageLoading } = useAuth();
  const companyId = user?.companyId;

  useEffect(() => {
    if (!pageLoading && !isAuthenticated) {
          window.location.href = "/login";
        }
  }, [pageLoading, isAuthenticated]);

  const { activeModal, openClient, closeModal } = useAuthModals();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [overview, setOverview] = useState({
    total: 0,
    vip: 0,
    newThisMonth: 0,
    averageSatisfaction: 0,
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverviewAndClients = async () => {
    try {
      setLoading(true);
      const response = await api.post("/Company/clients/overview_full");
      const data = response.data;

      if (data.status === "success") {
        setOverview(data.overview);
        console.log(overview)

        const formattedClients = (data.overview.clients || []).map((c) => ({
          clientName: c.name,
          clientType: c.category
            ? c.category[0].toUpperCase() + c.category.slice(1)
            : "Regular",
          email: c.email || "Não Informado",
          phoneNumber: formatPhone(c.phone) || "Não Informado",
          city: c.address || "Não Informado",
          totalSpent: c.totalSpent,
          lastPurchase: formatDateBR(c.lastPurchase) || "Ainda não comprou",
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
    if (!pageLoading && isAuthenticated && companyId) {
      fetchOverviewAndClients();
    }
  }, [pageLoading, isAuthenticated, companyId]);


  const filteredClients = clients.filter(c => {
    const matchesSearch =
      c.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phoneNumber?.includes(search);

    const matchesType =
      typeFilter === "all" ? true : c.clientType.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesType;
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
              <ClientCard icon={<LuUsers size={24}/>} value={overview.total} description="Total de Clientes" color="blue"/>
              <ClientCard icon={<LuStar size={24}/>} value={overview.vip} description="Clientes VIP" color="purple"/>
              <ClientCard icon={<LuCalendar size={24}/>} value={overview.newThisMonth} description="Novos este mês" color="orange"/>
              <ClientCard icon={<LuSmile size={24}/>} value={overview.averageSatisfaction} description="Satisfação Média" color="green"/>
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
        onSuccess={(apiResponse) => {
        const clientFormatted = {
          clientName: apiResponse.name,
          clientType: apiResponse.category
            ? apiResponse.category[0].toUpperCase() + apiResponse.category.slice(1)
            : "Regular",
          email: apiResponse.email || "Não Informado",
          phoneNumber: apiResponse.phone || "Não Informado",
          city: apiResponse.city || "Não Informado",
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
