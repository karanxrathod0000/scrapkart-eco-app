import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area,
} from 'recharts';
import * as firebaseService from '../../../services/firebaseService';
import LoadingSpinner from '../../common/LoadingSpinner';
import notificationService from '../../../services/notificationService';

const ChartCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)', marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0, color: 'var(--primary-color)' }}>{title}</h3>
        <div style={{ width: '100%', height: '300px' }}>
            {children}
        </div>
    </div>
);

const Analytics = () => {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        firebaseService.getAnalyticsData()
            .then(data => {
                setStats(data);
                setIsLoading(false);
            })
            .catch(err => {
                notificationService.showToast("Failed to load analytics.", "error");
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="container"><LoadingSpinner size="large" /></div>;
    }

  return (
    <div className="container">
        <div className="page-header">
            <h1>Admin Analytics</h1>
            <p>An overview of the platform's performance.</p>
        </div>
        
        <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
            <div className="stat-card">
                <p className="stat-card-value">{stats?.totalUsers || 0}</p>
                <p className="stat-card-label">Total Users</p>
            </div>
            <div className="stat-card">
                <p className="stat-card-value">{stats?.totalBookings || 0}</p>
                <p className="stat-card-label">Total Bookings</p>
            </div>
            <div className="stat-card">
                <p className="stat-card-value">{stats?.completedBookings || 0}</p>
                <p className="stat-card-label">Completed Bookings</p>
            </div>
             <div className="stat-card">
                <p className="stat-card-value">₹{stats?.totalRevenue.toFixed(2) || 0}</p>
                <p className="stat-card-label">Total Revenue</p>
            </div>
        </div>

        <ChartCard title="Booking Trends (Demo Data)">
            <ResponsiveContainer>
                <LineChart data={[
                      { name: 'Jan', bookings: 65, completed: 60 },
                      { name: 'Feb', bookings: 59, completed: 55 },
                      { name: 'Mar', bookings: 80, completed: 72 },
                      { name: 'Apr', bookings: 81, completed: 78 },
                    ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bookings" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="completed" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>

    </div>
  );
};

export default Analytics;