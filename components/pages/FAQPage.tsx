import React, { useState } from 'react';

const FAQ_DATA = [
    {
        question: "How is the price of scrap determined?",
        answer: "The price is based on the type of material and its weight. We use standardized, government-approved rates and a digital weighing scale to ensure accuracy and transparency. You can see an estimated price when you book."
    },
    {
        question: "What types of scrap do you collect?",
        answer: "We collect a wide variety of items, including paper, cardboard, plastics, metals (like iron, aluminum, and copper), and electronic waste. Please segregate items for a faster pickup process."
    },
    {
        question: "How do I get paid?",
        answer: "You get paid instantly at the time of pickup. Our collector will confirm the final amount after weighing, and you can choose to receive the payment via UPI (like Google Pay, PhonePe) or in cash."
    },
    {
        question: "Can I cancel or reschedule a pickup?",
        answer: "Yes, you can cancel or reschedule your pickup from the 'My Bookings' section up to 2 hours before your scheduled time slot. For last-minute changes, please contact our support chat."
    },
    {
        question: "Is there a minimum quantity for a pickup?",
        answer: "We recommend having at least 5-10 kg of scrap to make the pickup environmentally and economically efficient. However, there is no strict minimum. You can combine different types of scrap to meet this recommendation."
    }
];

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="faq-item">
            <button className="faq-question" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
                {question}
                <span>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <div className="faq-answer">{answer}</div>}
        </div>
    );
};

const FAQPage = () => {
    return (
        <div className="container">
            <div className="page-header">
                <h1>Frequently Asked Questions</h1>
                <p>Find answers to common questions about our services.</p>
            </div>
            <div>
                {FAQ_DATA.map((item, index) => (
                    <FAQItem key={index} question={item.question} answer={item.answer} />
                ))}
            </div>
        </div>
    );
};

export default FAQPage;
