import React from 'react';
import { Page } from '../../types';

interface InstructionsPanelProps {
    currentPage: Page;
}

const PAGE_INSTRUCTIONS: { [key in Page]?: { title: string; steps: string[] } } = {
    dashboard: {
        title: "Dashboard Tips",
        steps: [
            "Click 'Book New Pickup' to get started.",
            "Use the cards to quickly navigate to different sections.",
            "Track your collector in real-time for scheduled pickups."
        ]
    },
    booking: {
        title: "Booking Guide",
        steps: [
            "Fill in the scrap details and your address.",
            "Pin your exact location on the map for accuracy.",
            "The estimated price is based on your quantity input.",
            "Review all details in the confirmation pop-up before confirming."
        ]
    },
    profile: {
        title: "Managing Your Profile",
        steps: [
            "Keep your name, email, and address up to date.",
            "An updated profile picture helps collectors recognize you.",
            "Click 'Save Changes' after making any edits."
        ]
    },
    myBookings: {
        title: "Your Bookings",
        steps: [
            "Here you can see all your past and present bookings.",
            "Use the search bar to filter by scrap type or status.",
            "After a pickup is completed, you can rate the service."
        ]
    },
    // Add instructions for other pages as needed
};

const InstructionsPanel = ({ currentPage }: InstructionsPanelProps) => {
    const instructions = PAGE_INSTRUCTIONS[currentPage];

    if (!instructions) {
        return null; // Or return a default set of instructions
    }

    return (
        <aside className="instructions-panel">
            <h3>{instructions.title}</h3>
            <ul>
                {instructions.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ul>
        </aside>
    );
};

export default InstructionsPanel;
