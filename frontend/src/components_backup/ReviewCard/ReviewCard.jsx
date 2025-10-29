import "./ReviewCard.css"

import { FaStar } from 'react-icons/fa';

const ReviewCard = ({rating, name, business,comment}) => {
  return (
    <div className="review-card">
        <div className="rating">
            {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < rating ? "var(--primary-color)" : "gray"} />
            ))}
        </div>

        <p className="comment">"{comment}"</p>  

        <div>
            <p className="name">{name}</p>  
            <p className="business">{business}</p>
        </div>
    </div>
  )
}

export default ReviewCard