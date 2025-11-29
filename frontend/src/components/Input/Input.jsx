import React, { useState } from "react"
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri"

import "./Input.css"

/**
 * Input component
 * Supports icons and password visibility toggle.
 */
const Input = React.forwardRef(
  (
    {
      placeholder = "",
      icon = null,
      iconPosition = "right",
      maxLength,
      type = "text",
      style,
      ...rest
    },
    ref
  ) => {
    // Controls password visibility
    const [visible, setVisible] = useState(false)

    // Determines if input is a password field
    const isPassword = type === "password"

    // Resolves input type based on visibility state
    const resolvedType = isPassword
      ? visible
        ? "text"
        : "password"
      : type

    return (
      <div
        className={`input-with-icon ${iconPosition}`}
        style={style}
      >
        <input
          type={resolvedType}
          placeholder={placeholder}
          maxLength={maxLength}
          ref={ref}
          {...rest}
        />

        {/* Icon handling */}
        {isPassword ? (
          <span
            className="icon"
            style={{ cursor: "pointer" }}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? (
              <RiEyeFill size={20} />
            ) : (
              <RiEyeOffFill size={20} />
            )}
          </span>
        ) : (
          icon && (
            <span className="icon">
              {icon}
            </span>
          )
        )}
      </div>
    )
  }
)

export default Input