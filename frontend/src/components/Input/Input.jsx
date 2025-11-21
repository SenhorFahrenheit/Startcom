import React from 'react';
import './Input.css';

/**
 * Custom Input component with optional icon support
 * 
 * Props:
 * - placeholder: string, placeholder text inside the input
 * - icon: React node, optional icon element to display inside the input
 * - iconPosition: 'left' | 'right', position of the icon (default is 'right')
 * - maxLength: number, maximum number of characters allowed
 * - type: string, input type (default is 'text')
 * - ...rest: any other input props (onChange, value, etc.)
 */
const Input = React.forwardRef(({
  placeholder = '',
  icon = null,
  iconPosition = 'right', // "left" or "right"
  maxLength,
  type = 'text',
  style, 
  ...rest
}, ref) => {
  return (
    // Wrapper div to handle styling and icon positioning
    <div className={`input-with-icon ${iconPosition}`} style={style}>
      {/* Actual input element */}
      <input
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        ref={ref} // forwarded ref for parent access (e.g., React Hook Form)
        {...rest} // spread remaining props like onChange, value, etc.
      />
      {/* Conditionally render the icon if provided */}
      {icon && <span className="icon">{icon}</span>}
    </div>
  );
});

export default Input;
