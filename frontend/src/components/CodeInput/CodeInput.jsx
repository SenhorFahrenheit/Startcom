import { useState, useRef, useEffect } from "react";
import "./CodeInput.css";

const CodeInput = ({ length = 6, value, onChange, onComplete, autoFocus = true, isOpen }) => {
  const [codeArray, setCodeArray] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!isOpen) {
      setCodeArray(Array(length).fill(""));
    } else if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [isOpen, length, autoFocus]);

  useEffect(() => {
    if (value && value.length === length) setCodeArray(value.split(""));
  }, [value, length]);

  const handleChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;

    const newCode = [...codeArray];
    newCode[index] = val;
    setCodeArray(newCode);
    onChange?.(newCode.join(""));

    if (val && index < length - 1) inputsRef.current[index + 1].focus();
    if (newCode.join("").length === length) onComplete?.(newCode.join(""));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codeArray[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="code-input-wrapper">
      {codeArray.map((num, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={num}
          ref={(el) => (inputsRef.current[idx] = el)}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          aria-label={`Código ${idx + 1}`}
        />
      ))}
    </div>
  );
};

export default CodeInput;
