import { useState, useEffect, useRef } from "react"
import "./FilterSelect.css"

/**
 * FilterSelect component
 * Renders a dropdown for selecting filter options.
 */
const FilterSelect = ({
  label = "Filtrar",
  options = [],
  defaultValue,
  onSelect,
}) => {
  // Controls dropdown visibility
  const [isOpen, setIsOpen] = useState(false)

  // Stores the selected option label
  const [selected, setSelected] = useState(
    defaultValue ||
      (options[0] && options[0].label)
  )

  // Reference used to detect outside clicks
  const dropdownRef = useRef(null)

  /**
   * Handles option selection
   */
  const handleSelect = (option) => {
    setSelected(option.label)
    setIsOpen(false)

    if (onSelect) {
      onSelect(option.value)
    }
  }

  useEffect(() => {
    // Closes dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      )
  }, [])

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
    >
      {/* Dropdown trigger */}
      <button
        className="dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label} ({selected})
      </button>

      {/* Dropdown options */}
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className={
                selected === option.label
                  ? "selected"
                  : ""
              }
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FilterSelect
