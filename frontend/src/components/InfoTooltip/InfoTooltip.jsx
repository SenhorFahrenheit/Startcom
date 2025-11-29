import { useState } from "react"
import { FiInfo } from "react-icons/fi"

import "./InfoTooltip.css"

/**
 * InfoTooltip component
 * Displays contextual information on hover or click.
 */
const InfoTooltip = ({ text }) => {
  // Controls tooltip visibility
  const [open, setOpen] = useState(false)

  return (
    <div
      className="info-tooltip-container"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((prev) => !prev)}
    >
      {/* Tooltip trigger */}
      <button
        type="button"
        className="info-icon"
        onClick={() => setOpen((prev) => !prev)}
      >
        <FiInfo size={16} />
      </button>

      {/* Tooltip content */}
      {open && (
        <div className="info-tooltip-box">
          {text}
        </div>
      )}
    </div>
  )
}

export default InfoTooltip