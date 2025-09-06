import React from 'react';
import './Input.css';

const Input = React.forwardRef(({
  placeholder = '',
  icon = null,
  iconPosition = 'right', // "left" or "right"
  type = 'text',
  ...rest
}, ref) => {
  return (
    <div className={`input-with-icon ${iconPosition}`}>
      <input
        type={type}
        placeholder={placeholder}
        ref={ref}
        {...rest}
      />
      {icon && <span className="icon">{icon}</span>}
    </div>
  );
});

export default Input;
