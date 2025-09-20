import formattedDate from "../../utils/formattedDate"

import "./Dashboard.css"
import "./commonStyle.css"

import Sidebar from "../../layouts/Sidebar/Sidebar"

const Dashboard = () => {
  return (
    <section className="body-dashboard">
        <Sidebar/>

        <div className="content-dashboard">
          <div>
            <h1 className="title-page-section">Dashboard</h1>
            <p className="description-page-section">Visão geral do seu negócio - {formattedDate()}</p>
          </div>
        </div>
    </section>
  )
}

export default Dashboard