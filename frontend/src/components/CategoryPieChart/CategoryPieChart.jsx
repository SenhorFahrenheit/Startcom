import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { formatPercent } from "../../utils/format"

// Color palette used for pie chart segments
const COLORS = [
  "var(--primary-color)",
  "#03A0B9",
  "#025965",
  "#00C2D1",
  "#89E7F0",
  "#01454E",
]

/**
 * CategoryPieChart component
 * Displays category distribution in a responsive pie chart.
 */
const CategoryPieChart = ({ data }) => {
  // Tracks viewport size to adjust chart layout
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Updates mobile state based on window width
    const handleResize = () => setIsMobile(window.innerWidth < 600)

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Converts object data into Recharts-compatible format
  const formattedData =
    data && typeof data === "object"
      ? Object.entries(data).map(([name, value]) => ({
          name,
          value,
        }))
      : []

  return (
    <div className="chart">
      <h3 className="title-chart-dashboard">Categorias de Vendas</h3>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={formattedData}
            // Adjusts position and size for mobile layout
            cx={isMobile ? "50%" : "45%"}
            cy="45%"
            innerRadius={60}
            outerRadius={isMobile ? "105" : "120"}
            paddingAngle={3}
            dataKey="value"
          >
            {formattedData.map((entry, index) => (
              // Applies color based on index
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          {/* Displays value as percentage on hover */}
          <Tooltip formatter={(value) => `${formatPercent(value)}`} />

          <Legend
            // Layout adapts to screen size
            layout={isMobile ? "horizontal" : "vertical"}
            verticalAlign={isMobile ? "bottom" : "middle"}
            align={isMobile ? "center" : "right"}
            iconType="circle"
            formatter={(value, entry) =>
              `${value} (${formatPercent(entry.payload.value)})`
            }
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
  )
}

export default CategoryPieChart
