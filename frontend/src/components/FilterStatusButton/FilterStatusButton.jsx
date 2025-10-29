import { useState } from "react";

import "./FilterStatusButton.css";

import { LuFilter, LuCheck } from "react-icons/lu";

const FilterStatusButton = ({ options = [], onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Inicializa todas como true (selecionadas)
  const [selected, setSelected] = useState(
    options.reduce((acc, option) => {
      acc[option] = true;
      return acc;
    }, {})
  );

  const handleSelect = (option) => {
    const newSelected = { ...selected, [option]: !selected[option] }; // inverte o valor
    setSelected(newSelected);

    if (onSelect) onSelect(newSelected);
    setIsOpen(false)
  };

  return (
    <div className="dropdown-filter">
      <button className="dropdown-btn-filter" onClick={() => setIsOpen(!isOpen)}>
        <LuFilter size={16} /> Filtros
      </button>

      {isOpen && (
        <ul className="dropdown-menu-filter">
          {options.map((option) => (
            <li key={option} onClick={() => handleSelect(option)}>
                <span style={{ width: 16, display: "inline-block", textAlign: "center" }}>
                    {selected[option] ? <LuCheck size={16} /> : null}
                </span>
                {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterStatusButton;
