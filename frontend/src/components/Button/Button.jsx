import './Button.css';
import { ImSpinner8 } from "react-icons/im";

const Button = ({ 
  label, 
  onClick, 
  type = "button", 
  disabled = false, 
  variant,
  height,
  width,
  fontSize,
  fontWeight,
  styles,
  buttonColor,
  loading = false, // NOVO
}) => {
  return (
    <button
      style={{ height, width, fontSize, fontWeight, background: buttonColor }}
      className={`button ${variant} ${styles}`}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="button-loading">
          <ImSpinner8 className="spin" />
          {label}
        </span>
      ) : (
        label
      )}
    </button>
  );
};

export default Button;
