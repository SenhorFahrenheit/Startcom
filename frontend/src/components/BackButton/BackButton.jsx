import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import "./BackButton.css";

const BackButton = ({ onClick, label = "Voltar", icon = <MdOutlineArrowBackIosNew color='var(--secondary-color)' />, className = "" }) => {
  return (
    <button className={`back-button ${className}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
