import { useState, useRef, useEffect } from "react";
import { LuCalendar } from "react-icons/lu";

import "./FilterDateButton.css";

const FilterDateButton = ({ options = [], defaultValue, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || options[0]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  return (
    <div className="dropdown" ref={wrapperRef}>
      <button className="dropdown-btn" onClick={() => setIsOpen(!isOpen)}>
        <LuCalendar size={16} /> {selected}
      </button>

      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={selected === option ? "selected" : ""}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterDateButton;
