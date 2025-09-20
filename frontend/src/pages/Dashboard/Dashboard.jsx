import formattedDate from "../../utils/formattedDate"

import "./Dashboard.css"
import "../commonStyle.css"

import Sidebar from "../../layouts/Sidebar/Sidebar"
import FilterDateButton from "../../components/filterDateButton/filterDateButton"

const Dashboard = () => {
  return (
    <section className="body-section">
        <Sidebar/>

        <div className="content-page-section">
          <div className="align-heading">
            <div>
              <h1 className="title-page-section">Dashboard</h1>
              <p className="description-page-section">Visão geral do seu negócio - {formattedDate()}</p>
            </div>
            <FilterDateButton options={["Hoje", "7 dias", "30 dias", "1 ano", "Período completo"]}
              defaultValue="30 dias"
              onSelect={(val) => console.log("Período escolhido:", val)}
              />
          </div>
        </div>
    </section>
  )
}

export default Dashboard