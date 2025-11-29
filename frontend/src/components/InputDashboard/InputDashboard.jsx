import React from "react"

import "./InputDashboard.css"

/**
 * InputDashboard component
 * Simple input styled for dashboard usage.
 */
const InputDashboard = React.forwardRef(
  (
    {
      placeholder = "",
      maxLength,
      type = "text",
      readOnly = false,
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <input
        className={`InputDashboard ${style}`}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        ref={ref}
        readOnly={readOnly}
        {...rest}
      />
    )
  }
)

export default InputDashboard
