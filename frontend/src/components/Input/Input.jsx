import './Input.css';

const Input = ({
  placeholder = '',
  icon = null,
  iconPosition = 'right', // "left" or "right"
  type = 'text',
  value,
  onChange,
}) => {
  return (
    <div className={`input-with-icon ${iconPosition}`}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {icon && <span className="icon">{icon}</span>}
    </div>
  );
};

export default Input;
