// Styles
import "../commonStyle.css"; // Global styles
import "./Inventory.css"; // Page-specific styles

// Utilities
import { formatCurrency } from "../../utils/format"; // Format currency values

// Layouts
import Sidebar from "../../layouts/Sidebar/Sidebar"; // Sidebar layout
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile"; // Mobile header layout

// Components
import Button from "../../components/Button/Button"; // Reusable button
import NewProductModal from "../../components/Modals/NewProductModal"; // Modal to add new product
import ModifyProductModal from "../../components/Modals/ModifyProductModal"; // Modal to edit product
import DeleteProductModal from "../../components/Modals/DeleteProductModal"; // Modal to delete product
import ProductTable from "../../components/ProductTable/ProductTable"; // Table for inventory
import ProductCard from "../../components/ProductCard/ProductCard"; // Summary cards for inventory
import FilterSelect from "../../components/FilterSelect/FilterSelect"; // Dropdown filters

// Icons
import { LuPlus, LuBox, LuTrendingDown, LuTriangleAlert, LuPackage } from "react-icons/lu"; // Inventory icons

// Hooks
import { useAuthModals } from "../../hooks/useAuthModals"; // Modal control hook
import { useState, useEffect } from "react";
import api from "../../services/api"; // API service
import { useAuth } from "../../contexts/AuthContext"; // Auth context

const Inventory = () => {
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null); // Product selected for editing/deleting

  // Modals management
  const {
    activeModal,
    openProduct, // Open new product modal
    openModifyProduct, // Open edit product modal
    openDeleteInventory, // Open delete product modal
    closeModal // Close any modal
  } = useAuthModals(setSelectedProduct);

  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle

  // Auth context
  const { user, token, isAuthenticated, pageLoading } = useAuth();
  const companyId = user?.companyId;

  // Inventory overview
  const [overview, setOverview] = useState({
    totalProducts: 0,
    lowInventory: 0,
    criticalInventory: 0,
    totalValue: 0,
  });

  const [products, setProducts] = useState([]); // List of products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const toggleSidebar = () => setSidebarOpen(prev => !prev); // Toggle sidebar

  // Fetch inventory data from API
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get("/Company/inventory/overview");
      const data = response.data;

      if (!data || typeof data !== "object") throw new Error("Invalid server response");

      setOverview({
        totalProducts: data.totalProducts,
        lowInventory: data.lowInventory,
        criticalInventory: data.criticalInventory,
        totalValue: data.totalValue,
      });

      const formatted = (data.products || []).map(p => ({
        productId: p.productId,
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
      console.error("Error fetching inventory:", err);
      setError("Falha ao carregar estoque. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!pageLoading && !isAuthenticated) {
      window.location.href = "/login"
    };
  }, [pageLoading, isAuthenticated]);

  // Fetch inventory after authentication
  useEffect(() => {
    if (!pageLoading && isAuthenticated && companyId) {
      fetchInventory()
    };
  }, [pageLoading, isAuthenticated, companyId]);

  return (
    <section className="body-section">
      <HeaderMobile onToggleSidebar={toggleSidebar} /> {/* Mobile header */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} /> {/* Sidebar */}

      <div className="content-page-section">
        <div className="align-heading">
          <div>
            <h1 className="title-page-section">Estoque</h1> {/* Page title */}
            <p className="description-page-section">Controle completo do seu inventário</p> {/* Page description */}
          </div>

          <div className="buttons-container-inventory">
            {/* Buttons to open modals */}
            <div className="button-shadown">
              <Button
                className="hover-dashboard"
                onClick={openModifyProduct}
                height={"auto"}
                width={180}
                label={<><LuPlus size={"1.5rem"} />Produto Existente</>}
              />
            </div>

            <div className="button-shadown">
              <Button
                className="hover-dashboard"
                onClick={openProduct}
                height={"auto"}
                width={180}
                label={<><LuPlus size={"1.5rem"} />Novo Produto</>}
              />
            </div>
          </div>
        </div>

        {/* Inventory summary cards */}
        <div className="productCards">
          {[0, 1, 2, 3].map((idx) => (
            <ProductCard
              key={idx}
              title={["Total de Produtos","Estoque Baixo","Crítico","Valor Investido"][idx]}
              value={[overview.totalProducts, overview.lowInventory, overview.criticalInventory, formatCurrency(overview.totalValue)][idx]}
              extra={["", "Atenção necessária", "Reposição urgente", ""][idx]}
              color={["normal","warning","alert","normal"][idx]}
              icon={[<LuBox size={20}/>, <LuTrendingDown size={20}/>, <LuTriangleAlert size={20}/>, <LuPackage size={20}/>][idx]}
              loading={loading}
            />
          ))}
        </div>

        {/* Filters */}
        <div className="filter-search">
          <input
            style={{ fontSize: 14, paddingLeft: 16 }}
            className="InputDashboard"
            type="text"
            placeholder="Buscar produtos por nome"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="filters-block">
            <FilterSelect
              label="Categoria "
              options={[
                { label: "Todas", value: "all" },
                { label: "Roupas", value: "Roupas" },
                { label: "Calçados", value: "Calçados" },
                { label: "Acessórios", value: "Acessórios" },
                { label: "Eletrônicos", value: "Eletrônicos" },
                { label: "Informática", value: "Informática" },
                { label: "Alimentos", value: "Alimentos" },
                { label: "Bebidas", value: "Bebidas" },
                { label: "Móveis", value: "Móveis" },
                { label: "Decoração", value: "Decoração" },
                { label: "Livros", value: "Livros" },
                { label: "Brinquedos", value: "Brinquedos" },
                { label: "Esportes", value: "Esportes" },
                { label: "Beleza", value: "Beleza" },
                { label: "Saúde", value: "Saúde" },
                { label: "Papelaria", value: "Papelaria" },
                { label: "Ferramentas", value: "Ferramentas" },
                { label: "Autopeças", value: "Autopeças" },
                { label: "Pet Shop", value: "Pet Shop" },
                { label: "Limpeza", value: "Limpeza" },
                { label: "Outros", value: "Outros" }
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

        {/* Product table */}
        <div className="recent-sells">
          <div className="recentSells-title">
            <h3>Estoque</h3> {/* Table title */}
          </div>

          <ProductTable
            products={products}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            search={search}
            loading={loading}
            openDeleteInventory={openDeleteInventory} // Open delete modal
          />

          {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error if any */}
        </div>
      </div>

      {/* Modals */}
      <NewProductModal
        isOpen={activeModal === "inventory"}
        onClose={closeModal}
        onSuccess={() => fetchInventory()} // Refresh after success
      />

      <ModifyProductModal
        isOpen={activeModal === "modifyInventory"}
        onClose={closeModal}
        onSuccess={() => fetchInventory()} // Refresh after edit
      />

      <DeleteProductModal
        isOpen={activeModal === "deleteProduct"}
        onClose={closeModal}
        product={selectedProduct}
        onSuccess={() => fetchInventory()} // Refresh after deletion
      />
    </section>
  );
};

export default Inventory; // Export inventory page component