import "./GeneratedReport.css"
import { LuEye, LuDownload } from "react-icons/lu"

const GeneratedReport = ({icon, title, description, type, size, date, state}) => {
  return (
    <div className="GeneratedReport">
        <div className="generated-report-first-part">
            <div className="generated-report-icon">{icon}</div>
            <div className="generated-report-all-informations">
                <p className="generated-report-title">{title}</p>
                <p className="generated-report-description">{description}</p>
                <div className="generated-report-informations">
                    <p>Tipo: {type}</p>
                    <p>Tamanho: {size}</p>
                    <p>Data: {date}</p>
                </div>
            </div>
        </div>

        { state == "Pronto"
            ? 
        <div className="generated-report-actions">
            <div className={`generated-report-state ${state}`}>{state}</div>
            <button><LuEye size={16}/></button>
            <button><LuDownload size={16}/></button>
        </div>
            : 
        <div className={`generated-report-state ${state}`}>{state}</div>
        }
    </div>
  )
}

export default GeneratedReport