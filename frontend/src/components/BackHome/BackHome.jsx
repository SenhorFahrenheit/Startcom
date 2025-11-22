import "./BackHome.css"
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from "react-router-dom";

const BackHome = () => {
    const navigate = useNavigate();

    const handleBackHome = () => {
        navigate("/");
    }    

    return (
        <button className="icon-back-home" onClick={handleBackHome}>
            <MdArrowBack size={32}/>
        </button>
    )
}

export default BackHome