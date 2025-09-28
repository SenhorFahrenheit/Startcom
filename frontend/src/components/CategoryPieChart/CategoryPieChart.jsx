import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import axios from "axios"
import "./CategoryPieChart.css"

const COLORS = ["var(--primary-color)", "#A9BCD0", "#2F4858", "#91dff7ff"];

const CategoryPieChart = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // const res = await axios.get("http://localhost:5000/api/sales/categories");
        const res = {
          data: [
            { name: "Roupas", value: 35 },
            { name: "Calçados", value: 25 },
            { name: "Acessórios", value: 20 },
            { name: "Eletrônicos", value: 20 }
          ]
        };
        setData(res.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="chart">
      <h3 className="title-chart-dashboard">Categorias de Vendas</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx={isMobile ? "50%" : "45%"} 
            cy="45%"
            innerRadius={60}
            outerRadius={isMobile ? "105" : "120"} 
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend
            layout={isMobile ? "horizontal" : "vertical"}
            verticalAlign={isMobile ? "bottom" : "middle"} 
            align={isMobile ? "center" : "right"}   
            iconType="circle"
            formatter={(value, entry) => `${value} (${entry.payload.value}%)`}
            wrapperStyle={{
              fontFamily: "var(--font-heading)",
              fontSize: 14,
              color: "#374151",
              lineHeight: 2,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
