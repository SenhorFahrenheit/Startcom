import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
//import axios from "axios";

import "./SalesChart.css"

const SalesChart = () => {
  const [data, setData] = useState([]);


  useEffect(() => {
  async function fetchData() {
    try {
      // const res = await axios.get("http://localhost:5000/api/sales");
      const res = {
        data: [
          { month: "Jan", vendas: 12000, meta: 15000 },
          { month: "Feb", vendas: 17000, meta: 16000 },
          { month: "Mar", vendas: 14000, meta: 14000 },
          { month: "Apr", vendas: 22000, meta: 18000 },
          { month: "May", vendas: 31000, meta: 25000 },
          { month: "Jun", vendas: 26000, meta: 24000 }
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
      <h3 className="title-chart-dashboard">Desempenho de Vendas</h3>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fill: "#374151", fontSize: 14, fontFamily: "var(--font-base)" }}  />
          <YAxis
            tickFormatter={(value) => {
                if (value >= 1000) {
                return `R$ ${(value / 1000)}k`;
                }
                return `R$ ${value}`;
            }}
            tick={{ fill: "#374151", fontSize: 13, fontFamily: "var(--font-heading)" }}
            />
          <Tooltip />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{
            top: -20,
            fontFamily: "var(--font-heading)",
            fontSize: 14,
            color: "#374151"
            }}/>

          <Bar dataKey="vendas" fill="var(--primary-color)" name="Vendas" radius={[4,4,0,0]} />
          <Bar dataKey="meta" fill="#A9BCD0" name="Meta" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
