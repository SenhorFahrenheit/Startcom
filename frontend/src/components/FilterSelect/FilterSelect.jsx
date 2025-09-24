import { useState } from "react";
import "./FilterSelect.css";

const FilterSelect = ({ label = "Filtrar", options = [], defaultValue, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || (options[0] && options[0].label));

  const handleSelect = (option) => {
    setSelected(option.label);
    setIsOpen(false);
    if (onSelect) onSelect(option.value);
  };

  return (
    <div className="dropdown">
      <button className="dropdown-btn" onClick={() => setIsOpen(!isOpen)}>
        {label} ({selected})
      </button>

      {isOpen && (
        <ul className="dropdown-menu">
        {options.map((option) => (
            <li
            key={option.value}
            onClick={() => handleSelect(option)}
            className={selected === option.label ? "selected" : ""}
            >
            {option.label}
            </li>
        ))}
        </ul>
      )}
    </div>
  );
};

export default FilterSelect;
