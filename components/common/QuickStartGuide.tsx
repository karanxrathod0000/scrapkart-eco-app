import React from 'react';
import { Page } from '../../types';

interface QuickStartGuideProps {
    onNavigate: (page: Page) => void;
}

const QuickStartGuide = ({ onNavigate }: QuickStartGuideProps) => {
    return (
        <div className="quick-start-guide">
            <div className="quick-start-step">
                <div className="step-icon">👤</div>
                <strong>1. Sign Up</strong>
                <p>Create an account in seconds.</p>
            </div>
            <div className="quick-start-arrow">→</div>
            <div className="quick-start-step">
                <div className="step-icon">✅</div>
                <strong>2. Book Pickup</strong>
                <p>Schedule a convenient time.</p>
            </div>
            <div className="quick-start-arrow">→</div>
            <div className="quick-start-step">
                <div className="step-icon">💰</div>
                <strong>3. Get Paid</strong>
                <p>Receive cash on the spot.</p>
            </div>
        </div>
    );
};

export default QuickStartGuide;
