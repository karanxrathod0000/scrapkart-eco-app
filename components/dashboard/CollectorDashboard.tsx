import React, { useState, useEffect, useMemo } from 'react';
import { CollectorPickup, PickupStatus } from '../../types';
import * as firebaseService from '../../services/firebaseService';
import CollectorPickupCard from './CollectorPickupCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import notificationService from '../../services/notificationService';

const CollectorDashboard = () => {
    const { user } = useAuth();
    const collectorId = user?.uid;
    const [newAssignments, setNewAssignments] = useState<CollectorPickup[]>([]);
    const [activePickup, setActivePickup] = useState<CollectorPickup | null>(null);
    const [completedPickups, setCompletedPickups] = useState<CollectorPickup[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!collectorId) return;

        setIsLoading(true);

        // Listen for new/unassigned pickups
        const unsubscribeNew = firebaseService.listenToNewPickups((pickups) => {
            const filtered = pickups.filter(p => p.status === 'Assigned' && p.collectorId === collectorId || p.status === 'Pending');
            setNewAssignments(filtered as CollectorPickup[]);
        });

        // Listen for the single active pickup
        const unsubscribeActive = firebaseService.listenToActivePickup(collectorId, (pickup) => {
            setActivePickup(pickup as CollectorPickup | null);
        });

        // Fetch completed pickups once
        firebaseService.getCompletedPickupsForCollector(collectorId)
            .then(data => {
                setCompletedPickups(data as CollectorPickup[]);
                setIsLoading(false);
            })
            .catch(() => {
                notificationService.showToast("Failed to fetch completed pickups.", "error");
                setIsLoading(false);
            });

        return () => {
            unsubscribeNew();
            unsubscribeActive();
        };
    }, [collectorId]);

    const handleUpdateStatus = async (pickupId: string, status: PickupStatus, details?: { finalPrice?: number }) => {
        try {
            await firebaseService.updatePickupStatus(pickupId, status, { ...details, collectorId });
            notificationService.showToast(`Pickup #${pickupId.slice(0,5)} status updated to ${status}.`, 'success');
             if (status === 'Completed') {
                // Refresh completed list
                 firebaseService.getCompletedPickupsForCollector(collectorId!)
                    .then(data => setCompletedPickups(data as CollectorPickup[]));
            }
        } catch (error) {
            notificationService.showToast('Failed to update pickup status.', 'error');
        }
    };

    const earningsSummary = useMemo(() => {
        // This is a simplified calculation. A real app would use more robust date logic.
        const todaysEarnings = completedPickups.reduce((sum, p) => sum + (p.finalPrice || 0) * 0.8, 0);
        return { today: todaysEarnings, week: todaysEarnings, month: todaysEarnings };
    }, [completedPickups]);

    if (isLoading) {
        return <div className="container"><LoadingSpinner size="large" /></div>;
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>Collector Dashboard</h1>
                <p>Manage your pickups and track your earnings for the day.</p>
            </div>
            
             <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
                <div className="stat-card">
                    <p className="stat-card-value">₹{earningsSummary.today.toFixed(2)}</p>
                    <p className="stat-card-label">Today's Earnings</p>
                </div>
                <div className="stat-card">
                    <p className="stat-card-value">₹{earningsSummary.week.toFixed(2)}</p>
                    <p className="stat-card-label">This Week's Earnings</p>
                </div>
                <div className="stat-card">
                    <p className="stat-card-value">{newAssignments.length}</p>
                    <p className="stat-card-label">Available Pickups</p>
                </div>
            </div>

            {activePickup && (
                <div className="collector-dashboard-section">
                    <h2>Active Pickup</h2>
                    <CollectorPickupCard pickup={activePickup} onUpdateStatus={handleUpdateStatus} />
                </div>
            )}
            
            <div className="collector-dashboard-section">
                <h2>New Assignments ({newAssignments.length})</h2>
                {newAssignments.length > 0 ? (
                    newAssignments.map(p => <CollectorPickupCard key={p.id} pickup={p} onUpdateStatus={handleUpdateStatus} />)
                ) : (
                    <p>No new pickups assigned at the moment. We'll notify you when a new one comes in!</p>
                )}
            </div>

            <div className="collector-dashboard-section">
                <h2>Today's Completed Pickups ({completedPickups.length})</h2>
                 {completedPickups.length > 0 ? (
                    completedPickups.map(p => <CollectorPickupCard key={p.id} pickup={p} onUpdateStatus={handleUpdateStatus} />)
                ) : (
                    <p>No pickups completed yet today.</p>
                )}
            </div>
        </div>
    );
};

export default CollectorDashboard;