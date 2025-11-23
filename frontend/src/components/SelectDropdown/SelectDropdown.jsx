import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import "./SelectDropdown.css";

const SelectDropdown = ({
  label,
  items = [],
  placeholder = "Selecione...",
  onChange,
  name,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setSelectedLabel(item.label);
    setOpen(false);

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
      <div
        className="SelectDashboardTrigger"
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
