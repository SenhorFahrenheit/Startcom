import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from '../../utils/format';

const LineSalesChart = ({ data }) => {
  const formattedData = data && typeof data === "object"
    ? Object.entries(data).map(([month, value]) => ({
        month,
        vendas: value
      }))
    : [];

  return (
    <div className="chart">
      <h3 className="title-chart-dashboard">Evolução das Vendas</h3>

      <ResponsiveContainer>
        <LineChart data={formattedData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="month"
            tick={{ fill: "#374151", fontSize: 14, fontFamily: "var(--font-base)" }}
          />

          <YAxis
            tickFormatter={(value) => `${formatCurrency(value)}`}
            tick={{ fill: "#374151", fontSize: 11.25, fontFamily: "var(--font-heading)" }}
          />

          <Tooltip formatter={(value) => `${formatCurrency(value)}`} />

          <Line
            type="monotone"
            dataKey="vendas"
            stroke="var(--primary-color)"
            strokeWidth={3}
            dot={{ fill: "var(--primary-color)", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8 }}
            name="Vendas"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineSalesChart;
