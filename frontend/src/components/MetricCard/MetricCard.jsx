import "./MetricCard.css"
import { LuArrowUpRight } from "react-icons/lu"

/**
 * MetricCard component
 * Displays a metric value with status indication.
 */
const MetricCard = ({
  icon,
  state,
  description,
  value,
  data,
}) => {
  return (
    <div className="metricCard">
      {/* Icons section */}
      <div className="icons-part">
        <div className={`icon-metricCard ${state}`}>
          {icon}
        </div>

        <LuArrowUpRight
          className={`${state} noBackground`}
        />
      </div>

      {/* Text information */}
      <div className="texts-part">
        <p className="description">
          {description}
        </p>

        <p className="important-value">
          {value}
        </p>

        <p
          className={`data ${state} noBackground`}
        >
          {data}
        </p>
      </div>
    </div>
  )
}

export default MetricCard