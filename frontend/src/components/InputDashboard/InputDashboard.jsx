import React from "react";

import "./InputDashboard.css"

const InputDashboard = React.forwardRef(({
  placeholder = '',
  maxLength,
  type = 'text',
  ...rest
} , ref) => {
  return (
    <input className="InputDashboard" 
        type={type} 
        maxLength={maxLength} 
        placeholder={placeholder} 
        ref={ref}
        {...rest}  
    />
  )
});

export default InputDashboard