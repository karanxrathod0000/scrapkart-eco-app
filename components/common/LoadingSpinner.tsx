import React from 'react';

type SpinnerSize = 'small' | 'medium' | 'large';

interface LoadingSpinnerProps {
    size?: SpinnerSize;
}

const LoadingSpinner = ({ size = 'medium' }: LoadingSpinnerProps) => {
    return (
        <div className={`spinner-container spinner-${size}`}>
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingSpinner;
