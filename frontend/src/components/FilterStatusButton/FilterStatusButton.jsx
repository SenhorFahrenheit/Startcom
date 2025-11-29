import { useState } from "react"

import "./FilterStatusButton.css"

import { LuFilter, LuCheck } from "react-icons/lu"

/**
 * FilterStatusButton component
 * Allows toggling multiple status filters via dropdown.
 */
const FilterStatusButton = ({ options = [], onSelect }) => {
  // Controls dropdown visibility
  const [isOpen, setIsOpen] = useState(false)

  // Stores selection state for each option
  const [selected, setSelected] = useState(
    options.reduce((acc, option) => {
      acc[option] = true
      return acc
    }, {})
  )

  /**
   * Toggles the selected state of an option
   */
  const handleSelect = (option) => {
    const newSelected = {
      ...selected,
      [option]: !selected[option],
    }

    setSelected(newSelected)

    if (onSelect) {
      onSelect(newSelected)
    }

    setIsOpen(false)
  }

  return (
    <div className="dropdown-filter">
      {/* Dropdown trigger */}
      <button
        className="dropdown-btn-filter"
        onClick={() => setIsOpen(!isOpen)}
      >
        <LuFilter size={16} /> Filtros
      </button>

      {/* Dropdown options */}
      {isOpen && (
        <ul className="dropdown-menu-filter">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
            >
              {/* Selection indicator */}
              <span
                style={{
                  width: 16,
                  display: "inline-block",
                  textAlign: "center",
                }}
              >
                {selected[option] ? <LuCheck size={16} /> : null}
              </span>

              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FilterStatusButton