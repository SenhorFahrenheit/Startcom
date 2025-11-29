import "./BackHome.css"
import { MdArrowBack } from "react-icons/md"
import { useNavigate } from "react-router-dom"

/**
 * BackHome component
 * Renders a button that navigates the user back to the home route.
 */
const BackHome = () => {
    // React Router navigation handler
    const navigate = useNavigate()

    /**
     * Redirects the user to the home page
     */
    const handleBackHome = () => {
        navigate("/")
    }

    return (
        <button className="icon-back-home" onClick={handleBackHome}>
            <MdArrowBack size={32} />
        </button>
    )
}

export default BackHome
