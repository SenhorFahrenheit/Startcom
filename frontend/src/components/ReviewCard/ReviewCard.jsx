import { Star } from "lucide-react";
import "./ReviewCard.css";

/**
 * Displays a user review with star rating
 */
const ReviewCard = ({ rating, name, business, comment }) => {
  return (
    <div className="review-card">
      {/* Star rating display */}
      <div className="rating">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={i < rating ? "star-filled" : "star-empty"}
            fill={i < rating ? "currentColor" : "none"}
          />
        ))}
      </div>

      {/* Review comment */}
      <p className="comment">"{comment}"</p>

      {/* Reviewer information */}
      <div className="reviewer-info">
        <div className="avatar">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="reviewer-details">
          <p className="name">{name}</p>
          <p className="business">{business}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;