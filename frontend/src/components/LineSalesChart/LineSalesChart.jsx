import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import axios from "axios";

import formatCurrency from '../../utils/format';

const LineSalesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // const res = await axios.get("http://localhost:5000/api/sales/monthly");
        const res = {
          data: [
            { month: "Jan", vendas: 4000 },
            { month: "Feb", vendas: 7000 },
            { month: "Mar", vendas: 2000 },
            { month: "Apr", vendas: 5000 },
            { month: "May", vendas: 5500 },
            { month: "Jun", vendas: 8000 }
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
      <h3 className="title-chart-dashboard">Evolução das Vendas</h3>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#374151", fontSize: 14, fontFamily: "var(--font-base)" }}
          />
          <YAxis
            tickFormatter={(value) =>
              value = `${formatCurrency(value)}`
            }
            tick={{ fill: "#374151", fontSize: 13, fontFamily: "var(--font-heading)" }}
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
