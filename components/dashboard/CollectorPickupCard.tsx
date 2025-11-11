import React, { useState } from 'react';
import { CollectorPickup, PickupStatus } from '../../types';
import { MOCK_PRICES } from '../../services/firebaseService';

interface CollectorPickupCardProps {
    pickup: CollectorPickup;
    onUpdateStatus: (pickupId: string, status: PickupStatus, details?: { finalPrice?: number }) => void;
}

const CollectorPickupCard = ({ pickup, onUpdateStatus }: CollectorPickupCardProps) => {
    const [weight, setWeight] = useState(pickup.estimatedWeight || 0);
    const [finalPrice, setFinalPrice] = useState(pickup.finalPrice || 0);

    const calculatePrice = (scrapType: string, weight: number): number => {
        return (MOCK_PRICES[scrapType] || MOCK_PRICES['Other']) * weight;
    };

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWeight = parseFloat(e.target.value) || 0;
        setWeight(newWeight);
        setFinalPrice(calculatePrice(pickup.scrapType, newWeight));
    };
    
    const renderActions = () => {
        switch(pickup.status) {
            case 'Pending':
            case 'Assigned':
                return (
                    <>
                        <button className="action-btn accept" onClick={() => onUpdateStatus(pickup.id, 'Accepted')}>✓ Accept</button>
                        <button className="action-btn reject" onClick={() => onUpdateStatus(pickup.id, 'Rejected')}>✗ Reject</button>
                    </>
                );
            case 'Accepted':
                 return (
                    <>
                        <button className="action-btn" onClick={() => onUpdateStatus(pickup.id, 'InProgress')}>▶ Start Journey</button>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${pickup.location.lat},${pickup.location.lng}`} target="_blank" rel="noopener noreferrer" className="action-btn navigate">🗺️ Navigate</a>
                        <a href={`tel:${pickup.customerPhone}`} className="action-btn call">📞 Call Customer</a>
                    </>
                );
            case 'InProgress':
                return (
                     <>
                        <button className="action-btn" onClick={() => onUpdateStatus(pickup.id, 'Collected')}>Mark as Collected</button>
                         <a href={`https://www.google.com/maps/search/?api=1&query=${pickup.location.lat},${pickup.location.lng}`} target="_blank" rel="noopener noreferrer" className="action-btn navigate">🗺️ Navigate</a>
                        <a href={`tel:${pickup.customerPhone}`} className="action-btn call">📞 Call Customer</a>
                    </>
                );
            case 'Collected':
                 return (
                    <div className="price-calculation-section">
                        <h4>Calculate Final Price</h4>
                        <div className="form-group">
                            <label>Actual Weight (kg)</label>
                            <input type="number" value={weight} onChange={handleWeightChange} />
                        </div>
                        <p>Scrap Type: <strong>{pickup.scrapType}</strong></p>
                        <p className="calculated-price">Final Price: ₹{finalPrice.toFixed(2)}</p>
                        <button 
                            className="action-btn" 
                            onClick={() => onUpdateStatus(pickup.id, 'Completed', { finalPrice })}
                            disabled={finalPrice <= 0}
                        >
                            ✓ Complete Pickup
                        </button>
                    </div>
                );
            case 'Completed':
                return <p><strong>Pickup Completed.</strong> Final Amount: ₹{pickup.finalPrice?.toFixed(2)}</p>
            case 'Rejected':
                return <p><strong>Assignment Rejected.</strong></p>
            default:
                return null;
        }
    };

    return (
        <div className={`pickup-card status-${pickup.status}`}>
            <div className="pickup-card-header">
                <h3>Pickup #{pickup.id.slice(0, 7)} - {pickup.customerName}</h3>
                <span className={`status-badge status-${pickup.status}`}>{pickup.status}</span>
            </div>
            <div className="pickup-card-body">
                <div className="pickup-card-info">
                    <strong>Address</strong>
                    <p>{pickup.address}</p>
                </div>
                <div className="pickup-card-info">
                    <strong>Pickup Time</strong>
                    <p>{pickup.pickupDate}</p>
                </div>
                <div className="pickup-card-info">
                    <strong>Scrap Details</strong>
                    <p>{pickup.scrapType} (~{pickup.estimatedWeight} kg)</p>
                </div>
                 <div className="pickup-card-info">
                    <strong>Est. Price</strong>
                    <p>₹{pickup.estimatedPrice?.toFixed(2)}</p>
                </div>
            </div>
            <div className="pickup-card-actions">
                {renderActions()}
            </div>
        </div>
    );
};

export default CollectorPickupCard;