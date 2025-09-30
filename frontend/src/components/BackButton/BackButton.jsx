import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import "./BackButton.css";

/**
 * BackButton component
 *
 * A reusable button to navigate back, typically used in modals or pages.
 *
 * Props:
 * - onClick: function, callback fired when button is clicked
 * - label: string, text displayed next to the back icon (default: "Voltar")
 * - icon: React node, custom icon to display (default: left arrow icon)
 * - className: string, additional CSS class names for customization
 * - color: string, CSS color for text/icon
 */
const BackButton = ({ 
  onClick, 
  label = "Voltar", 
  icon = <MdOutlineArrowBackIosNew color="currentColor" />,
  color,
  className = "" 
}) => {
  return (
    <button 
      className={`back-button ${className}`} 
      style={{ color }}
      onClick={onClick}
    >
      {icon}
      <span style={{color}} className="back-button-text">{label}</span>
    </button>
  );
};

export default BackButton;
