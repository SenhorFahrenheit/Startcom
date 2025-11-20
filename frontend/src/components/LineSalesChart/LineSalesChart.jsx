import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { formatCurrency, formatMonthLabel, formatDateBR } from "../../utils/format";

const monthNames = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const normalizeKey = (key) => {
  const month = monthNames[key];
  if (month) {
    const year = new Date().getFullYear();
    return `${year}-${String(month).padStart(2, "0")}`;
  }

  const parsed = new Date(key);
  if (!isNaN(parsed.getTime())) return key;

  if (/^\d{4}-\d{2}$/.test(key)) return key;

  return null;
};

const fillMissingDays = (data, daysBack) => {
  const now = new Date();
  const result = [];

  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().split("T")[0];

    result.push({
      date: key,
      vendas: data[key] ?? 0,
    });
  }

  return result;
};

const fillMissingMonths = (data, monthsBack = 6) => {
  const now = new Date();
  const result = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    result.push({
      date: key,
      vendas: data[key] ?? 0,
    });
  }

  return result;
};

const ranges = {
  "7d": { type: "day", amount: 7 },
  "30d": { type: "day", amount: 30 },
  "6m": { type: "month", amount: 6 },
  "1y": { type: "month", amount: 12 },
};

const LineSalesChart = ({ data, period }) => {
  const range = ranges[period] || { type: "month", amount: 6 };

  const normalizedData = {};

  Object.entries(data || {}).forEach(([key, value]) => {
    const norm = normalizeKey(key);
    if (!norm) return;

    if (range.type === "day" && norm.length === 7) return;

    if (range.type === "month" && norm.length === 10) {
      const parsed = new Date(norm);
      const monthKey = `${parsed.getFullYear()}-${String(
        parsed.getMonth() + 1
      ).padStart(2, "0")}`;

      normalizedData[monthKey] = (normalizedData[monthKey] || 0) + value;
      return;
    }

    normalizedData[norm] = value;
  });

  const formattedData =
    range.type === "day"
      ? fillMissingDays(normalizedData, range.amount)
      : fillMissingMonths(normalizedData, range.amount);

  return (
    <div className="chart">
      <h3 className="title-chart-dashboard">Evolução das Vendas</h3>

      <ResponsiveContainer>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            tick={false}
            axisLine={false}
            tickFormatter={(value) =>
              range.type === "day"
                ? formatDateBR(value)
                : formatMonthLabel(value)
            }
          />

          <YAxis
            tickFormatter={(value) => `${formatCurrency(value)}`}
            tick={{ fill: "#374151", fontSize: 11.25, fontFamily: "var(--font-heading)" }}
          />
          
          <Tooltip
            formatter={(v) => formatCurrency(v)}
            labelFormatter={(label) =>
              range.type === "day"
                ? formatDateBR(label)
                : formatMonthLabel(label)
            }
          />

          <Line
            type="monotone"
            dataKey="vendas"
            stroke="var(--primary-color)"
            strokeWidth={3}
            dot={{ r: 0 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineSalesChart;
