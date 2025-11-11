import React, { useState } from 'react';

interface OnboardingProps {
    onFinish: () => void;
}

const ONBOARDING_STEPS = [
    {
        title: "Welcome to ScrapKart!",
        content: "Let's take a quick tour to help you get started with turning your scrap into cash.",
    },
    {
        title: "1. Schedule a Pickup",
        content: "Easily book a scrap pickup from your dashboard. Just choose the type of scrap, estimate the quantity, and select a convenient date.",
    },
    {
        title: "2. Track Your Earnings",
        content: "Visit the 'My Earnings' page to see how much you've earned and the positive environmental impact you've made.",
    },
    {
        title: "3. Manage Your Profile",
        content: "Keep your contact information and address up to date in the 'My Profile' section to ensure smooth pickups.",
    },
    {
        title: "You're All Set!",
        content: "That's it! You're ready to start recycling and earning. If you need help, look for the instructions panel on the right side of the screen.",
    }
];

const Onboarding = ({ onFinish }: OnboardingProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = ONBOARDING_STEPS.length;

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onFinish();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const step = ONBOARDING_STEPS[currentStep];

    return (
        <div className="modal-overlay">
            <div className="modal-content onboarding-modal-content">
                <div className="modal-body">
                    <div className="onboarding-step-indicator">
                        {ONBOARDING_STEPS.map((_, index) => (
                            <div key={index} className={`onboarding-step-dot ${currentStep === index ? 'active' : ''}`}></div>
                        ))}
                    </div>
                    <div className="onboarding-content">
                        <h3>{step.title}</h3>
                        <p>{step.content}</p>
                    </div>
                    <div className="onboarding-navigation">
                        {currentStep > 0 ? (
                            <button className="secondary-button onboarding-skip-btn" onClick={onFinish}>Skip</button>
                        ) : <div></div>}
                        <div>
                             {currentStep > 0 && (
                                <button className="secondary-button" onClick={handlePrev} style={{marginRight: '1rem'}}>Previous</button>
                             )}
                            <button onClick={handleNext}>
                                {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
