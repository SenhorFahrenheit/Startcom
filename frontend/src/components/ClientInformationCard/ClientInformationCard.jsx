import "./ClientInformationCard.css"

import { LuMail, LuPhone, LuMapPin } from "react-icons/lu"

const ClientInformationCard = ({clientName, clientType, email, phoneNumber, city, totalSpent, lastPurchase}) => {
  
  const iconLetters = (name) => {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    const initials = words.map(word => word[0].toUpperCase());
    return initials.slice(0, 3).join('');
  }
  
  return (
    <div className="ClientInformationCard">
        <div className="client-name-type-information">
          <div className="client-letters-icon">{iconLetters(clientName)}</div>
          <div className="cliient-name-type">
            <p>{clientName}</p>
            <div className={`${clientType}`}>{clientType}</div>
          </div>
        </div>

        <div className="client-information-part">
          <div className="client-information-part-item"><LuMail/> {email}</div>
          <div className="client-information-part-item"><LuPhone/> {phoneNumber}</div>
          <div className="client-information-part-item"><LuMapPin/> {city}</div>
        </div>

        <div className="line-client-part"></div>

        <div className="total-spent"><p>Total gasto</p> {totalSpent}</div>
        <div className="last-purchase"><p>Última compra</p> {lastPurchase}</div>
    </div>
  )
}

export default ClientInformationCard