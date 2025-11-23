import React, { useState } from "react";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";

import "./Input.css";

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
    const [visible, setVisible] = useState(false);

    const isPassword = type === "password";
    const resolvedType = isPassword ? (visible ? "text" : "password") : type;

    return (
      <div className={`input-with-icon ${iconPosition}`} style={style}>
        <input
          type={resolvedType}
          placeholder={placeholder}
          maxLength={maxLength}
          ref={ref}
          {...rest}
        />
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
          icon && <span className="icon">{icon}</span>
        )}
      </div>
    );
  }
);

export default Input;
