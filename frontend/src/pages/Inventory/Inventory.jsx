import "../commonStyle.css";
import "./Inventory.css";

import formatCurrency from "../../utils/format";

import Sidebar from "../../layouts/Sidebar/Sidebar";
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile";
import Button from "../../components/Button/Button";
import NewProductModal from "../../components/Modals/NewProductModal";
import ProductTable from "../../components/ProductTable/ProductTable";
import ProductCard from "../../components/ProductCard/ProductCard";

import FilterSelect from "../../components/FilterSelect/FilterSelect";

import { LuPlus, LuBox, LuTrendingDown, LuTriangleAlert, LuPackage } from "react-icons/lu";

import { useAuthModals } from "../../hooks/useAuthModals";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const Inventory = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { activeModal, openProduct, closeModal } = useAuthModals();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, token, isAuthenticated, pageLoading } = useAuth();
  const companyId = user?.companyId;

  const [overview, setOverview] = useState({
    totalProducts: 0,
    lowInventory: 0,
    criticalInventory: 0,
    totalValue: 0,
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const response = await api.post("/Company/inventory/overview");

      const data = response.data;

      if (!response.data || typeof response.data !== "object") {
        throw new Error("Resposta inválida do servidor");
      }

      setOverview({
        totalProducts: data.totalProducts,
        lowInventory: data.lowInventory,
        criticalInventory: data.criticalInventory,
        totalValue: data.totalValue,
      });

      const formatted = (data.products || []).map(p => ({
        name: p.name,
        category: p.category,
        quantity: p.quantity,
        minQuantity: p.minQuantity,
        unitPrice: p.unitPrice,
        status: p.status,
        totalValue: p.totalValue,
      }));

      setProducts(formatted);

    } catch (err) {
      console.error("Erro ao buscar inventário:", err);
      setError("Erro ao carregar inventário");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pageLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
    if (!pageLoading && isAuthenticated && companyId) {
      fetchInventory();
    }
  }, [pageLoading, isAuthenticated, companyId]);

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
              height={"auto"}
              width={160}
              label={<><LuPlus size={"1.5rem"} />Novo Produto</>}
            />
          </div>
        </div>

        <div className="productCards">
          <ProductCard
            title="Total de Produtos"
            value={overview.totalProducts}
            color="normal"
            icon={<LuBox size={20} />}
          />

          <ProductCard
            title="Estoque Baixo"
            value={overview.lowInventory}
            extra="Atenção necessária"
            color="warning"
            icon={<LuTrendingDown size={20} />}
          />

          <ProductCard
            title="Crítico"
            value={overview.criticalInventory}
            extra="Reposição urgente"
            color="alert"
            icon={<LuTriangleAlert size={20} />}
          />

          <ProductCard
            title="Valor Total"
            value={formatCurrency(overview.totalValue)}
            color="normal"
            icon={<LuPackage size={20} />}
          />
        </div>

        <div className="filter-search">
          <input
            style={{ fontSize: 14, paddingLeft: 16 }}
            className="InputDashboard"
            type="text"
            placeholder="Buscar produtos por nome, código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="filters-block">
            <FilterSelect
              label="Categoria: "
              options={[
                { label: "Todas", value: "all" },
                { label: "Roupas", value: "Roupas" },
                { label: "Calçados", value: "Calçados" },
                { label: "Acessórios", value: "Acessórios" },
              ]}
              defaultValue="Todas"
              onSelect={setCategoryFilter}
            />

            <FilterSelect
              label="Status: "
              options={[
                { label: "Todos", value: "all" },
                { label: "Normal", value: "Normal" },
                { label: "Baixo", value: "Baixo" },
                { label: "Crítico", value: "Crítico" },
                { label: "Esgotado", value: "Esgotado" },
              ]}
              defaultValue="Todos"
              onSelect={setStatusFilter}
            />
          </div>
        </div>

        <div className="recent-sells">
          <div className="recentSells-title">
            <h3>Inventário</h3>
          </div>

          {loading ? (
            <p>Carregando inventário...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <ProductTable
              products={products}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
              search={search}
            />
          )}
        </div>
      </div>

      <NewProductModal
        isOpen={activeModal === "inventory"}
        onClose={closeModal}
        onSuccess={() => fetchInventory()}
      />
    </section>
  );
};

export default Inventory;
