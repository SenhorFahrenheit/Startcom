import './ButtonLogin.css';

const ButtonLogin = ({
  icon = null,
  iconPosition = 'right',
  type = 'button',
  onClick,
  children,
}) => {
  return (
    <button type={type} onClick={onClick} className={`button-with-icon ${iconPosition}`}>
      {icon && iconPosition === 'left' && <span className="icon">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="icon">{icon}</span>}
    </button>
  );
};

export default ButtonLogin;
