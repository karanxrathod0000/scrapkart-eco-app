import React, { useState } from 'react';
import notificationService from '../../services/notificationService';
import { Page } from '../../types';

interface RecurringBookingProps {
    onNavigate: (page: Page) => void;
}

const RecurringBooking = ({ onNavigate }: RecurringBookingProps) => {
    const [frequency, setFrequency] = useState('weekly');
    const [dayOfWeek, setDayOfWeek] = useState('Monday');
    const [dayOfMonth, setDayOfMonth] = useState(1);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [scrapType, setScrapType] = useState('Paper');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            frequency,
            day: frequency === 'weekly' ? dayOfWeek : dayOfMonth,
            startDate,
            scrapType,
        });
        notificationService.showToast(`Your ${frequency} pickup has been scheduled!`, 'success');
        onNavigate('myBookings');
    };

    return (
        <div className="container">
            <div className="form-container wide" style={{ margin: '0 auto', textAlign: 'left' }}>
                <div className="booking-form-header">
                    <button className="back-button" onClick={() => onNavigate('dashboard')} aria-label="Go back to dashboard">&larr;</button>
                    <h1>Schedule a Recurring Pickup</h1>
                </div>
                <p style={{ color: 'var(--light-text-color)', marginTop: '-0.5rem', marginBottom: '2rem' }}>
                    Set up an automatic pickup schedule for your convenience.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="scrapType">Default Scrap Type</label>
                        <select id="scrapType" value={scrapType} onChange={e => setScrapType(e.target.value)}>
                            <option value="Paper">Paper</option>
                            <option value="Plastic">Plastic</option>
                            <option value="Metal">Metal</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Other">Mixed/Other</option>
                        </select>
                        <p className="form-help-text">You can change this for individual pickups later.</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="frequency">Frequency</label>
                        <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value)}>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    {frequency === 'weekly' ? (
                        <div className="form-group">
                            <label htmlFor="dayOfWeek">Day of the Week</label>
                            <select id="dayOfWeek" value={dayOfWeek} onChange={e => setDayOfWeek(e.target.value)}>
                                <option>Monday</option>
                                <option>Tuesday</option>
                                <option>Wednesday</option>
                                <option>Thursday</option>
                                <option>Friday</option>
                                <option>Saturday</option>
                                <option>Sunday</option>
                            </select>
                        </div>
                    ) : (
                        <div className="form-group">
                            <label htmlFor="dayOfMonth">Day of the Month</label>
                            <input
                                type="number"
                                id="dayOfMonth"
                                min="1"
                                max="31"
                                value={dayOfMonth}
                                placeholder="e.g., 15"
                                onChange={e => setDayOfMonth(parseInt(e.target.value, 10))}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <p className="form-help-text">Your first recurring pickup will be on the first selected day after this date.</p>
                    </div>
                    
                    <button type="submit" style={{ width: '100%' }}>Set Schedule</button>
                </form>
            </div>
        </div>
    );
};

export default RecurringBooking;