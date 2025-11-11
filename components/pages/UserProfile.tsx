import React, { useState, useEffect } from 'react';
import ImageUpload from '../common/ImageUpload';
import notificationService from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';
import * as firebaseService from '../../services/firebaseService';
import LoadingSpinner from '../common/LoadingSpinner';

const UserProfile = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [bookingHistory, setBookingHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            Promise.all([
                firebaseService.getUserProfile(user.uid),
                firebaseService.getPickupsForUser(user.uid)
            ]).then(([profile, bookings]) => {
                setUserData(profile);
                // get most recent 5
                const recentBookings = bookings.slice(0, 5);
                setBookingHistory(recentBookings);
                setIsLoading(false);
            }).catch(err => {
                notificationService.showToast('Failed to load profile data.', 'error');
                setIsLoading(false);
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleProfilePictureUpload = (url: string) => {
        setUserData((prev: any) => ({ ...prev, photoURL: url }));
        // The URL is saved to state, and will be saved to DB on submit
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            await firebaseService.updateUserProfile(user.uid, {
                displayName: userData.displayName,
                address: userData.address,
                phone: userData.phone,
                photoURL: userData.photoURL,
            });
            notificationService.showToast('Your profile has been saved.', 'success');
        } catch (error) {
            notificationService.showToast('Failed to save profile.', 'error');
        }
    };

    if (isLoading || !userData) {
        return <div className="container"><LoadingSpinner size="large"/></div>;
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>My Profile</h1>
                <p>Manage your personal information and view your activity.</p>
            </div>

            <div className="user-profile-layout">
                <div className="profile-sidebar">
                    <div className="profile-picture-container">
                        <img src={userData.photoURL || 'https://i.pravatar.cc/150'} alt="User profile" className="profile-picture" />
                    </div>
                    <h4>Update Profile Picture</h4>
                    <ImageUpload onUploadComplete={handleProfilePictureUpload} uploadPath={`profile-pictures/${user?.uid}`} />
                </div>

                <div className="profile-main-content">
                    <form onSubmit={handleSubmit}>
                        <h2>Personal Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input type="text" id="name" name="displayName" value={userData.displayName || ''} onChange={handleInputChange} placeholder="e.g., Jane Doe" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" name="email" value={userData.email || ''} disabled />
                            </div>
                             <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="tel" id="phone" name="phone" value={userData.phone || ''} onChange={handleInputChange} placeholder="e.g., 987-654-3210" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <textarea id="address" name="address" value={userData.address || ''} onChange={handleInputChange} rows={3} placeholder="Enter your full address"></textarea>
                        </div>
                        <div className="profile-actions">
                            <button type="submit">Save Changes</button>
                        </div>
                    </form>

                    <h2 style={{marginTop: '2rem'}}>Recent Booking History</h2>
                    <div className="table-container">
                         <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingHistory.map(b => (
                                    <tr key={b.id}>
                                        <td>#{b.id.slice(0, 7)}</td>
                                        <td>{b.pickupDate}</td>
                                        <td>{b.scrapType}</td>
                                        <td><span className={`status-badge status-${b.status}`}>{b.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;