import './Button.css';

const Button = ({ 
    label, 
    onClick, 
    type = "button", 
    disabled = false, 
    variant
}) => {
  return (
    <button className={`button ${variant}`} onClick={onClick} type={type} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
