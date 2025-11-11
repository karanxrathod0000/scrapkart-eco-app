import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CollectorPickup } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import * as firebaseService from '../../services/firebaseService';
import LoadingSpinner from '../common/LoadingSpinner';
import notificationService from '../../services/notificationService';


const weeklyEarningsData = [
    { name: 'Week 1', earnings: 0 },
    { name: 'Week 2', earnings: 0 },
    { name: 'Week 3', earnings: 0 },
    { name: 'Week 4', earnings: 0 },
];

const CollectorEarnings = () => {
    const { user } = useAuth();
    const [completedPickups, setCompletedPickups] = useState<(CollectorPickup & { payoutStatus: 'Paid' | 'Pending' })[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            firebaseService.getCompletedPickupsForCollector(user.uid)
                .then(data => {
                    // Assuming all are pending payout for this demo
                    const pickupsWithStatus = data.map(p => ({...p, payoutStatus: 'Pending'})) as (CollectorPickup & { payoutStatus: 'Paid' | 'Pending' })[];
                    setCompletedPickups(pickupsWithStatus);
                    setIsLoading(false);
                })
                .catch(err => {
                    notificationService.showToast('Failed to fetch earnings data.', 'error');
                    setIsLoading(false);
                });
        }
    }, [user]);

    const commissionRate = 0.80; // 80% commission
    const totalEarnings = completedPickups.reduce((acc, p) => acc + (p.finalPrice || 0), 0) * commissionRate;
    
    if (isLoading) {
        return <div className="container"><LoadingSpinner size="large" /></div>;
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>My Earnings</h1>
                <p>A detailed overview of your earnings and payouts.</p>
            </div>
            
            <div className="stat-card" style={{ marginBottom: '2rem', textAlign: 'left' }}>
                <h3 style={{marginTop: 0}}>Total Earnings (All Time): <span style={{color: 'var(--primary-color)'}}>₹{totalEarnings.toFixed(2)}</span></h3>
                <p>This is your total take-home amount after platform fees.</p>
            </div>

            <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)', marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0, color: 'var(--primary-color)' }}>Weekly Earnings Trend (Demo)</h3>
                <div style={{ width: '100%', height: '300px' }}>
                     <ResponsiveContainer>
                        <BarChart data={weeklyEarningsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="earnings" fill="var(--primary-color)" name="Earnings (₹)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="page-header" style={{border: 0, padding: 0, marginBottom: '1rem'}}>
                 <h2>Completed Pickups</h2>
            </div>
            <div className="table-container" style={{ marginBottom: '2rem' }}>
                 <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Final Amount (₹)</th>
                            <th>Your Earning (80%)</th>
                            <th>Payout Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedPickups.map(p => (
                            <tr key={p.id}>
                                <td>#{p.id.slice(0, 7)}</td>
                                <td>{p.customerName}</td>
                                <td>{p.finalPrice?.toFixed(2)}</td>
                                <td><strong>{(p.finalPrice! * commissionRate).toFixed(2)}</strong></td>
                                <td><span className={`status-badge status-${p.payoutStatus}`}>{p.payoutStatus}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default CollectorEarnings;