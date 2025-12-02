import "./Clients.css"; // Page-specific styles
import "../commonStyle.css"; // Global/common styles

import { formatCurrency, formatDateBR, formatPhone } from '../../utils/format'; // Utility functions for formatting

import Sidebar from "../../layouts/Sidebar/Sidebar"; // Sidebar layout
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile"; // Mobile header layout
import Button from "../../components/Button/Button"; // Reusable button component

import NewClientModal from "../../components/Modals/NewClientModal"; // Modal to create a new client
import ModifyClientModal from "../../components/Modals/ModifyClientModal"; // Modal to modify existing client
import DeleteClientModal from "../../components/Modals/DeleteClientModal"; // Modal to delete a client
import ClientInformationCard from "../../components/ClientInformationCard/ClientInformationCard"; // Card displaying client details
import ClientCard from "../../components/ClientCard/ClientCard"; // Overview card component
import FilterSelect from "../../components/FilterSelect/FilterSelect"; // Dropdown filter component

import { useState, useEffect } from "react"; // React hooks
import { useAuthModals } from "../../hooks/useAuthModals"; // Custom hook for modal state
import api from "../../services/api"; // API service for requests
import { useAuth } from "../../contexts/AuthContext"; // Authentication context

import { LuPlus, LuSmile, LuUsers, LuStar, LuCalendar } from "react-icons/lu"; // Icons

import Skeleton from "react-loading-skeleton"; // Loading skeleton
import "react-loading-skeleton/dist/skeleton.css"; // Skeleton styles

const Clients = () => {
  // Auth and user info
  const { token, user, isAuthenticated, pageLoading } = useAuth();
  const companyId = user?.companyId;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!pageLoading && !isAuthenticated) {
        window.location.href = "/login";
    }
  }, [pageLoading, isAuthenticated]);

  // Modal state handlers
  const { activeModal, openClient, openModifyClient, openDeleteClient, closeModal } = useAuthModals();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle

  // Filters and search state
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Overview statistics
  const [overview, setOverview] = useState({
    total: 0,
    vip: 0,
    newThisMonth: 0,
    averageSatisfaction: 0,
  });

  const [clients, setClients] = useState([]); // Clients list
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [editingClient, setEditingClient] = useState(null); // Client being edited

  // Open modify client modal
  const handleEdit = (id) => {
    const found = clients.find(c => c.id === id);
    setEditingClient(found);
    openModifyClient();
  };

  // Open delete client modal
  const handleDelete = (id) => {
    const found = clients.find(c => c.id === id);
    setEditingClient(found);
    openDeleteClient();
  };

  // Fetch overview stats and client list from API
  const fetchOverviewAndClients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/Company/clients/overview_full");
      const data = response.data;

      if (data.status === "success") {
        setOverview(data.overview);

        // Format client data for display
        const formattedClients = (data.overview.clients || [])
          .map((c) => ({
            id: c.id,
            clientName: c.name,
            clientType: c.category ? c.category[0].toUpperCase() + c.category.slice(1) : "Regular",
            email: c.email || "Não Informado",
            phoneNumber: formatPhone(c.phone?.replace(/^\+55/, "")) || "Não Informado",
            city: c.address || "Não Informado",
            totalSpent: c.totalSpent,
            lastPurchase: c.lastPurchase ? formatDateBR(c.lastPurchase) : "Ainda não comprou",
          }))
          .sort((a, b) => {
            if (a.lastPurchase === "Ainda não comprou") return -1;
            if (b.lastPurchase === "Ainda não comprou") return 1;

            const da = new Date(a.lastPurchase.split("/").reverse().join("-"));
            const db = new Date(b.lastPurchase.split("/").reverse().join("-"));

            return db - da;
          });
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

  // Fetch data after auth and page load
  useEffect(() => {
    if (!pageLoading && isAuthenticated && companyId) {
      fetchOverviewAndClients();
    }
  }, [pageLoading, isAuthenticated, companyId]);

  // Filter clients by search and type
  const filteredClients = clients.filter(c => {
    const matchesSearch =
      c.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phoneNumber?.includes(search);

    const matchesType =
      typeFilter === "all" ? true : c.clientType.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesType;
  });

  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      // Ctrl + +
      if (event.ctrlKey && (event.key === "+" || event.key === "=")) {
        event.preventDefault();
        openClient();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openClient]);

  return (
    <section className="body-section">
      <HeaderMobile onToggleSidebar={toggleSidebar} /> {/* Mobile header */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} /> {/* Sidebar */}

      <div className="content-page-section">
        <div className="align-heading">
          <div>
            <h1 className="title-page-section">Clientes</h1> {/* Page title */}
            <p className="description-page-section">
              Gerencie sua base de clientes e relacionamentos
            </p> {/* Page description */}
          </div>
          <div className="button-shadown">
            <Button 
              className="hover-dashboard" 
              onClick={openClient} 
              height={"auto"} 
              width={200} 
              label={<>Novo Cliente <span style={{ fontSize: 14,padding: "3px 12px", borderRadius: "var(--border-radius)", background: "#ffffffff", color: "var(--primary-color)" }}>Ctrl +</span></>}
            /> {/* Open new client modal */}
          </div>
        </div>

        <section className="clientCards">
          {loading ? (
            // Loading skeleton for overview cards
            [0, 1, 2, 3].map((idx) => (
              <div key={idx} className="ClientCard">
                <div className={`client-icon-card client-card-skeleton`}>
                  <Skeleton circle width={40} height={40} />
                </div>
                <p className="client-value-card"><Skeleton width={60} /></p>
                <p className="client-description-card"><Skeleton width={100} /></p>
              </div>
            ))
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p> // Show API error
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
          /> {/* Search input */}
          <div className="filters-block">
            <FilterSelect
              label="Filtrar por"
              options={[
                { label: "Todos", value: "all" },
                { label: "VIP", value: "vip" },
                { label: "Premium", value: "premium" },
                { label: "Regular", value: "regular" },
              ]}
              defaultValue="Todos"
              onSelect={(val) => setTypeFilter(val)}
            /> {/* Client type filter */}
          </div>
        </div>    

        <div className="clientInformationCards">
          {loading
            ? [0,1,2].map((_, idx) => (
                <ClientInformationCard key={idx} loading={true} />
              )) // Loading skeleton for client cards
            : filteredClients.map((c, idx) => (
              <ClientInformationCard
                key={idx}
                _id={c.id}
                clientName={c.clientName}
                clientType={c.clientType}
                email={c.email}
                phoneNumber={c.phoneNumber}
                city={c.city}
                totalSpent={formatCurrency(c.totalSpent)}
                lastPurchase={c.lastPurchase}
                onEdit={handleEdit}
                onDelete={handleDelete}
              /> // Render filtered client cards
            ))
          }
        </div>

      </div>

      {/* Modals */}
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
        fetchOverviewAndClients(); // Refresh data
      }}
      />

      <ModifyClientModal
        isOpen={activeModal === "modifyClient"}
        onClose={() => {
          setEditingClient(null);
          closeModal();
        }}
        clientData={editingClient}
        onSuccess={() => {
          fetchOverviewAndClients(); // Refresh data
        }}
      />

      <DeleteClientModal
        isOpen={activeModal === "deleteClient"}
        onClose={closeModal}
        onSuccess={(deletedClientId) => {
          setClients(prev => prev.filter(c => c.id !== deletedClientId));
          fetchOverviewAndClients(); // Refresh data
        }}
        clientData={editingClient}
      />
    </section>
  )
}

export default Clients; // Export component