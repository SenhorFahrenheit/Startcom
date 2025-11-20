import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatPercent } from "../../utils/format";

const COLORS = ["var(--primary-color)", "#A9BCD0", "#2F4858", "#91dff7ff"];

const CategoryPieChart = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formattedData =
    data && typeof data === "object"
      ? Object.entries(data).map(([name, value]) => ({
          name,
          value,
        }))
      : [];

  return (
    <div className="chart">
      <h3 className="title-chart-dashboard">Categorias de Vendas</h3>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={formattedData}
            cx={isMobile ? "50%" : "45%"}
            cy="45%"
            innerRadius={60}
            outerRadius={isMobile ? "105" : "120"}
            paddingAngle={3}
            dataKey="value"
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip formatter={(value) => `${formatPercent(value)}`} />

          <Legend
            layout={isMobile ? "horizontal" : "vertical"}
            verticalAlign={isMobile ? "bottom" : "middle"}
            align={isMobile ? "center" : "right"}
            iconType="circle"
            formatter={(value, entry) => `${value} (${formatPercent(entry.payload.value)})`}
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
