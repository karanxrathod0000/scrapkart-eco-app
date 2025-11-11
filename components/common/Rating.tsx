import React, { useState } from 'react';

interface RatingProps {
    // FIX: Changed bookingId from number to string to align with Firestore ID format.
    bookingId: string;
    // FIX: Updated onSubmit prop to expect bookingId as a string.
    onSubmit: (bookingId: string, rating: number, feedback: string) => void;
}

const Rating = ({ bookingId, onSubmit }: RatingProps) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a star rating before submitting.');
            return;
        }
        onSubmit(bookingId, rating, feedback);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <h4>Rate Your Pickup Experience</h4>
            <div className="star-rating">
                {[5, 4, 3, 2, 1].map((star) => (
                    <React.Fragment key={star}>
                        <input
                            type="radio"
                            id={`star${star}-${bookingId}`}
                            name={`rating-${bookingId}`}
                            value={star}
                            checked={rating === star}
                            onChange={() => setRating(star)}
                        />
                        <label htmlFor={`star${star}-${bookingId}`}>&#9733;</label>
                    </React.Fragment>
                ))}
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
                <textarea
                    placeholder="Share your feedback (optional)..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
            </div>
            <button type="submit" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Submit Feedback</button>
        </form>
    );
};

export default Rating;