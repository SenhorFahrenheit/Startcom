import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
//import axios from "axios";

import { formatCurrency } from '../../utils/format';

import "./SalesChart.css"

const SalesChart = ({ period }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    let res;
    if (period === "Hoje") {
      res = {
        data: [
          { month: "09h", vendas: 500, meta: 700 },
          { month: "12h", vendas: 1200, meta: 1000 },
          { month: "15h", vendas: 300, meta: 800 },
        ]
      };
    } else if (period === "7 dias") {
      res = {
        data: [
          { month: "Seg", vendas: 8000, meta: 9000 },
          { month: "Ter", vendas: 7000, meta: 7500 },
          { month: "Qua", vendas: 6000, meta: 7000 },
          { month: "Qui", vendas: 9000, meta: 8000 },
          { month: "Sex", vendas: 12000, meta: 10000 },
          { month: "Sab", vendas: 8000, meta: 9500 },
          { month: "Dom", vendas: 7000, meta: 7000 },
        ]
      };
    } else if (period === "30 dias") {
        res = {
          data: [
            { month: "01", vendas: 1200, meta: 1500 },
            { month: "02", vendas: 900, meta: 1200 },
            { month: "03", vendas: 1500, meta: 1500 },
            { month: "04", vendas: 2000, meta: 1800 },
            { month: "05", vendas: 1800, meta: 2000 },
            { month: "06", vendas: 2200, meta: 2100 },
            { month: "07", vendas: 2500, meta: 2300 },
            { month: "08", vendas: 2600, meta: 2500 },
            { month: "09", vendas: 2000, meta: 2100 },
            { month: "10", vendas: 2400, meta: 2300 },
            { month: "11", vendas: 2700, meta: 2500 },
            { month: "12", vendas: 3000, meta: 2800 },
            { month: "13", vendas: 2800, meta: 3000 },
            { month: "14", vendas: 2600, meta: 2500 },
            { month: "15", vendas: 2200, meta: 2300 },
            { month: "16", vendas: 2100, meta: 2000 },
            { month: "17", vendas: 2400, meta: 2500 },
            { month: "18", vendas: 2300, meta: 2400 },
            { month: "19", vendas: 2500, meta: 2500 },
            { month: "20", vendas: 2700, meta: 2600 },
            { month: "21", vendas: 2800, meta: 2700 },
            { month: "22", vendas: 2900, meta: 3000 },
            { month: "23", vendas: 3100, meta: 3200 },
            { month: "24", vendas: 3000, meta: 3100 },
            { month: "25", vendas: 3200, meta: 3000 },
            { month: "26", vendas: 2800, meta: 2900 },
            { month: "27", vendas: 2600, meta: 2700 },
            { month: "28", vendas: 2700, meta: 2600 },
            { month: "29", vendas: 3000, meta: 3100 },
            { month: "30", vendas: 3100, meta: 3000 },
          ]
        }
      } else if (period === "1 ano") {
          res = {
            data: [
              { month: "Jan", vendas: 12000, meta: 13000 },
              { month: "Feb", vendas: 15000, meta: 14000 },
              { month: "Mar", vendas: 14000, meta: 15000 },
              { month: "Apr", vendas: 17000, meta: 16000 },
              { month: "May", vendas: 20000, meta: 19000 },
              { month: "Jun", vendas: 18000, meta: 20000 },
              { month: "Jul", vendas: 22000, meta: 21000 },
              { month: "Aug", vendas: 21000, meta: 22000 },
              { month: "Sep", vendas: 23000, meta: 24000 },
              { month: "Oct", vendas: 25000, meta: 23000 },
              { month: "Nov", vendas: 28000, meta: 26000 },
              { month: "Dec", vendas: 30000, meta: 28000 },
            ]
          }
        } else {
          res = {
            data: [
              { month: "2020", vendas: 120000, meta: 110000 },
              { month: "2021", vendas: 150000, meta: 140000 },
              { month: "2022", vendas: 180000, meta: 170000 },
              { month: "2023", vendas: 200000, meta: 190000 },
              { month: "2024", vendas: 250000, meta: 230000 },
              { month: "2025", vendas: 270000, meta: 260000 },
            ]
          };
        }
        setData(res.data);
      }, [period]);

  return (
    <div className="chart">
      <h3 className="title-chart-dashboard">Desempenho de Vendas</h3>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 0, left: 30, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="month"/>
          <YAxis tickFormatter={(value) => `${formatCurrency(value)}`} />
          <Tooltip formatter={(value) => `${formatCurrency(value)}`}/>
          <Legend />
          <Bar dataKey="vendas" fill="var(--primary-color)" name="Vendas" />
          <Bar dataKey="meta" fill="#A9BCD0" name="Meta" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
