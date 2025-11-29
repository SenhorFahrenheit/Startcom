import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import "./SelectDropdown.css";

// Custom select dropdown component
const SelectDropdown = ({
  label,
  items = [],
  placeholder = "Selecione...",
  onChange,
  name,
}) => {
  // Controls dropdown open state
  const [open, setOpen] = useState(false);

  // Stores selected item label
  const [selectedLabel, setSelectedLabel] = useState("");

  // Stores selected item value
  const [selectedValue, setSelectedValue] = useState("");

  // Reference for detecting outside clicks
  const wrapperRef = useRef(null);

  // Closes dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handles item selection
  const handleSelect = (item) => {
    setSelectedLabel(item.label);
    setSelectedValue(item.value);
    setOpen(false);

    // Simulates native input change event
    onChange?.({
      target: {
        name,
        value: item.value,
        item,
      },
    });
  };

  return (
    <div style={{ width: "100%", position: "relative" }} ref={wrapperRef}>
      {/* Hidden input to integrate with forms */}
      <input type="hidden" name={name} value={selectedValue} />

      {/* Dropdown trigger */}
      <div
        className={`SelectDashboardTrigger ${open ? "selectedTrigger" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span className="SelectDashboardText">
          {selectedLabel || placeholder}
        </span>

        <FaChevronDown
          size={14}
          className={`SelectDashboardIcon ${open ? "open" : ""}`}
        />
      </div>

      {/* Dropdown list */}
      {open && (
        <ul className="SelectDashboardList">
          {items.map((item) => (
            <li
              key={item.value}
              className="SelectDashboardItem"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(item)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectDropdown;