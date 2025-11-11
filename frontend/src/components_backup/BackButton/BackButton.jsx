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
 */
const BackButton = ({ 
  onClick, 
  label = "Voltar", 
  icon = <MdOutlineArrowBackIosNew color='var(--secondary-color)' />, 
  className = "" 
}) => {
  return (
    <button 
      className={`back-button ${className}`} // Base style + optional custom classes
      onClick={onClick} // Click event handler
    >
      {icon} {/* Render the icon */}
      <span className="back-button-text">{label}</span> {/* Render the label */}
    </button>
  );
};

export default BackButton;
