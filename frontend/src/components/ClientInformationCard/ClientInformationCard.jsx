import "./ClientInformationCard.css"
import {
  LuMail,
  LuPhone,
  LuMapPin,
  LuTrash2,
  LuPencil,
} from "react-icons/lu"
import { Ellipsis } from "lucide-react"

import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useState } from "react"

/**
 * ClientInformationCard component
 * Displays detailed client information with loading and actions.
 */
const ClientInformationCard = ({
  _id,
  clientName,
  clientType,
  email,
  phoneNumber,
  city,
  totalSpent,
  lastPurchase,
  loading,
  onEdit,
  onDelete,
}) => {
  // Controls visibility of the dropdown menu
  const [openMenu, setOpenMenu] = useState(false)

  /**
   * Generates initials from the client name
   */
  const iconLetters = (name) => {
    if (!name) return ""
    const words = name.trim().split(/\s+/)
    return words
      .map((word) => word[0].toUpperCase())
      .slice(0, 3)
      .join("")
  }

  return (
    <div className="ClientInformationCard">
      <div className="client-header">
        <div className="client-name-type-information">
          {/* Initials or loading skeleton */}
          <div className="client-letters-icon">
            {loading ? (
              <Skeleton circle width={50} height={50} />
            ) : (
              iconLetters(clientName)
            )}
          </div>

          <div className="client-name-type">
            {/* Client name */}
            <p className="text-nowrap-ellipses">
              {loading ? <Skeleton width={120} /> : clientName}
            </p>

            {/* Client type */}
            <div className={`${clientType}`}>
              {loading ? <Skeleton width={60} /> : clientType}
            </div>
          </div>
        </div>

        {/* Action menu */}
        {!loading && (
          <div className="dropdown-container-client">
            <button
              className="dropdown-trigger-client"
              onClick={() => setOpenMenu((prev) => !prev)}
            >
              <Ellipsis />
            </button>

            {openMenu && (
              <div className="dropdown-menu-client">
                {/* Edit action */}
                <button
                  className="dropdown-item-client edit"
                  onClick={() => {
                    setOpenMenu(false)
                    onEdit(_id)
                  }}
                >
                  <LuPencil />
                </button>

                {/* Delete action */}
                <button
                  className="dropdown-item-client delete"
                  onClick={() => {
                    setOpenMenu(false)
                    onDelete(_id)
                  }}
                >
                  <LuTrash2 />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact information */}
      <div className="client-information-part">
        <div className="client-information-part-item">
          <LuMail />
          {loading ? <Skeleton width={150} /> : email}
        </div>

        <div className="client-information-part-item">
          <LuPhone />
          {loading ? <Skeleton width={120} /> : phoneNumber}
        </div>

        <div className="client-information-part-item">
          <LuMapPin />
          {loading ? <Skeleton width={100} /> : city}
        </div>
      </div>

      <div className="line-client-part" />

      {/* Total spent */}
      <div className="total-spent">
        <p>Total gasto</p>
        {loading ? <Skeleton width={80} /> : totalSpent}
      </div>

      {/* Last purchase */}
      <div className="last-purchase">
        <p>Última compra</p>
        {loading ? <Skeleton width={100} /> : lastPurchase}
      </div>
    </div>
  )
}

export default ClientInformationCard
