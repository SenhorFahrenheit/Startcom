import './ButtonLogin.css';

/**
 * ButtonLogin component
 *
 * A customizable button component that can display an icon on the left or right.
 *
 * Props:
 * - icon: React node, optional icon element to display inside the button
 * - iconPosition: 'left' | 'right', position of the icon relative to the text (default: 'right')
 * - type: string, button type attribute (default: 'button')
 * - onClick: function, callback fired when button is clicked
 * - children: React node, button label or content
 */
const ButtonLogin = ({
  icon = null,
  iconPosition = 'right',
  type = 'button',
  onClick,
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button-with-icon ${iconPosition}`} // Add class for styling and icon positioning
    >
      {/* Render icon on the left if iconPosition is 'left' */}
      {icon && iconPosition === 'left' && <span className="icon">{icon}</span>}

      {/* Render button text/content */}
      {children}

      {/* Render icon on the right if iconPosition is 'right' */}
      {icon && iconPosition === 'right' && <span className="icon">{icon}</span>}
    </button>
  );
};

export default ButtonLogin;
