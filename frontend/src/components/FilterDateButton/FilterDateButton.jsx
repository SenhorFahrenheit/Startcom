import { useState, useRef, useEffect } from "react"
import { LuCalendar } from "react-icons/lu"

import "./FilterDateButton.css"

/**
 * FilterDateButton component
 * Provides a dropdown button for date-based filtering.
 */
const FilterDateButton = ({ options = [], defaultValue, onSelect }) => {
  // Controls dropdown visibility
  const [isOpen, setIsOpen] = useState(false)

  // Stores the selected option
  const [selected, setSelected] = useState(
    defaultValue || options[0]
  )

  // Reference used to detect outside clicks
  const wrapperRef = useRef(null)

  useEffect(() => {
    // Closes dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () =>
      document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /**
   * Handles option selection
   */
  const handleSelect = (option) => {
    setSelected(option)
    setIsOpen(false)

    if (onSelect) {
      onSelect(option)
    }
  }

  return (
    <div
      className="dropdown"
      ref={wrapperRef}
    >
      {/* Dropdown trigger */}
      <button
        className="dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <LuCalendar size={16} /> {selected}
      </button>

      {/* Dropdown options */}
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={
                selected === option ? "selected" : ""
              }
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FilterDateButton