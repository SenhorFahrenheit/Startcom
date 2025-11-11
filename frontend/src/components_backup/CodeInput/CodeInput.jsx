import { useState, useRef, useEffect } from "react";
import "./CodeInput.css";

/**
 * CodeInput component for entering verification codes (e.g., 2FA or password reset)
 *
 * Props:
 * - length: number, number of code digits (default 6)
 * - value: string, current code value (controlled component)
 * - onChange: function, called whenever the code changes
 * - onComplete: function, called when the code is completely filled
 * - autoFocus: boolean, whether to focus the first input automatically (default true)
 * - isOpen: boolean, whether the input is active/open (resets when false)
 */
const CodeInput = ({ length = 6, value, onChange, onComplete, autoFocus = true, isOpen }) => {
  // Local state to store individual digits
  const [codeArray, setCodeArray] = useState(Array(length).fill(""));

  // Refs to each input field for programmatic focus control
  const inputsRef = useRef([]);

  // Reset inputs or autofocus when modal/dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCodeArray(Array(length).fill(""));
    } else if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [isOpen, length, autoFocus]);

  // Sync controlled value with internal state
  useEffect(() => {
    if (value && value.length === length) setCodeArray(value.split(""));
  }, [value, length]);

  // Handle input changes
  const handleChange = (index, val) => {
    // Only allow numeric input
    if (!/^\d*$/.test(val)) return;

    const newCode = [...codeArray];
    newCode[index] = val;
    setCodeArray(newCode);

    // Call onChange callback with full code
    onChange?.(newCode.join(""));

    // Move focus to next input if current is filled
    if (val && index < length - 1) inputsRef.current[index + 1].focus();

    // Call onComplete callback if all inputs are filled
    if (newCode.join("").length === length) onComplete?.(newCode.join(""));
  };

  // Handle backspace navigation
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
          inputMode="numeric" // Mobile keyboards show numeric keypad
          maxLength={1} // Only one digit per input
          value={num}
          ref={(el) => (inputsRef.current[idx] = el)} // Store ref for focus control
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          aria-label={`Código ${idx + 1}`} // Accessibility label
        />
      ))}
    </div>
  );
};

export default CodeInput;
