import "./Button.css"
import { ImSpinner8 } from "react-icons/im"

/**
 * Reusable button component with style and loading support
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
  fontWeight,
  styles,
  buttonColor,
  loading = false,
}) => {
  return (
    <button
      // Inline styles for dynamic layout and appearance
      style={{ height, width, fontSize, fontWeight, background: buttonColor }}
      className={`button ${variant} ${styles}`}
      onClick={onClick}
      type={type}
      // Prevents interaction while disabled or loading
      disabled={disabled || loading}
    >
      {loading ? (
        // Loading state with spinner and label
        <span className="button-loading">
          <ImSpinner8 className="spin" />
          {label}
        </span>
      ) : (
        // Default button label
        label
      )}
    </button>
  )
}

export default Button
