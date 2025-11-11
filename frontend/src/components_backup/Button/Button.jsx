import './Button.css';

/**
 * Button component
 *
 * A reusable button component with optional styling variants.
 *
 * Props:
 * - label: string, text displayed inside the button
 * - onClick: function, callback fired when the button is clicked
 * - type: string, button type attribute (default: "button")
 * - disabled: boolean, whether the button is disabled (default: false)
 * - variant: string, optional CSS class to define button style (e.g., primary, secondary)
 */
const Button = ({ 
    label, 
    onClick, 
    type = "button", 
    disabled = false, 
    variant,
    height,
    width,
    fontSize,
    fontWeight
}) => {
  return (
    <button style={{height, width, fontSize, fontWeight}}
      className={`button ${variant}`} // Apply base and variant-specific styles
      onClick={onClick}
      type={type}
      disabled={disabled} // Disable button if needed
    >
      {label} {/* Render button text */}
    </button>
  );
};

export default Button;
