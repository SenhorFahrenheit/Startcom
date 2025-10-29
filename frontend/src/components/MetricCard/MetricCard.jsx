import "./MetricCard.css"
import { LuArrowUpRight } from 'react-icons/lu';

const MetricCard = ({icon, state, description, value, data}) => {
  return (
    <div className="metricCard">
        <div className="icons-part">
            <div className={`icon-metricCard ${state}`}>{icon}</div>
            <LuArrowUpRight className={`${state} noBackground`}/>
        </div>

        <div className="texts-part">
            <p className="description">{description}</p>
            <p className="important-value">{value}</p>
            <p className={`data ${state} noBackground`}>{data}</p>
        </div>
    </div>
  )
}

export default MetricCard