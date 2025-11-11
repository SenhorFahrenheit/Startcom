import React from "react";

import "./InputDashboard.css"

const InputDashboard = React.forwardRef(({
  placeholder = '',
  maxLength,
  type = 'text',
  readonly = false,
  ...rest
} , ref) => {
  return (
    <input className="InputDashboard" 
        type={type} 
        maxLength={maxLength} 
        placeholder={placeholder} 
        ref={ref}
        readonly={readonly}
        {...rest}  
    />
  )
});

export default InputDashboard