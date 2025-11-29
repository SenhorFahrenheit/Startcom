import "./ReviewCard.css";
import { FaStar } from "react-icons/fa";

/**
 * Displays a user review with star rating
 */
const ReviewCard = ({ rating, name, business, comment }) => {
  return (
    <div className="review-card">
      {/* Star rating display */}
      <div className="rating">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            color={i < rating ? "var(--primary-color)" : "gray"}
          />
        ))}
      </div>

      {/* Review comment */}
      <p className="comment">"{comment}"</p>

      {/* Reviewer information */}
      <div>
        <p className="name">{name}</p>
        <p className="business">{business}</p>
      </div>
    </div>
  );
};

export default ReviewCard;