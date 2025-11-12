import React, { useState, FormEvent, useMemo, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import ToastContainer from './components/common/Toast';
import notificationService from './services/notificationService';
import Rating from './components/common/Rating';
import Analytics from './components/dashboard/admin/Analytics';
import RealTimeTracker from './components/dashboard/RealTimeTracker';
import PaymentIntegration from './components/common/PaymentIntegration';
import ChatSupport from './components/common/ChatSupport';
import ImageUpload from './components/common/ImageUpload';
import UserProfile from './components/pages/UserProfile';
import RecurringBooking from './components/forms/RecurringBooking';
import AdminUserManagement from './components/dashboard/admin/AdminUserManagement';
import CollectorRouteOptimization from './components/dashboard/CollectorRouteOptimization';
import Onboarding from './components/common/Onboarding';
import HelpTooltip from './components/common/HelpTooltip';
import InstructionsPanel from './components/common/InstructionsPanel';
import QuickStartGuide from './components/common/QuickStartGuide';
import FAQPage from './components/pages/FAQPage';
import CollectorDashboard from './components/dashboard/CollectorDashboard';
import CollectorEarnings from './components/dashboard/CollectorEarnings';
import { Page } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MOCK_PRICES, createPickupRequest, getPickupsForUser, updatePickupRating } from './services/firebaseService';

// Inform TypeScript about the global Leaflet object 'L'
declare var L: any;

// --- Reusable Components ---

const Modal = ({ isOpen, onClose, children, title }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string; }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close-button" onClick={onClose} aria-label="Close modal">&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

const Navbar = ({ onNavigate }: { onNavigate: (page: Page) => void; }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const { user, userRole, logout } = useAuth();
    const isLoggedIn = !!user;

    const getHomePage = () => {
        if (!isLoggedIn) return 'home';
        if (userRole === 'collector') return 'collectorDashboard';
        return 'dashboard';
    };

    const handleLogout = async () => {
        try {
            await logout();
            onNavigate('home');
            notificationService.showToast('You have been logged out.', 'info');
        } catch (error) {
            notificationService.showToast('Failed to log out.', 'error');
        }
    };
    
    const profileInitial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U';

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                     <div className="navbar-logo" onClick={() => onNavigate(getHomePage())}>
                        ScrapKart
                    </div>
                     <div className="nav-links">
                        <a className="nav-link" onClick={() => onNavigate('home')}>Home</a>
                        <a className="nav-link" onClick={() => onNavigate('howItWorks')}>How It Works</a>
                        <a className="nav-link" onClick={() => onNavigate('faq')}>FAQ</a>
                        <a className="nav-link" onClick={() => onNavigate('about')}>About</a>
                        <a className="nav-link" onClick={() => onNavigate('contact')}>Contact</a>
                    </div>
                </div>
                <div className="nav-links">
                    {isLoggedIn ? (
                         <div className="profile-menu" onMouseLeave={() => setDropdownOpen(false)}>
                            <div 
                                className="profile-avatar" 
                                onMouseEnter={() => setDropdownOpen(true)}
                                style={{ backgroundImage: user.photoURL ? `url(${user.photoURL})` : 'none' }}
                            >
                                {!user.photoURL && profileInitial.toUpperCase()}
                            </div>
                             {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    {userRole === 'user' && (
                                        <>
                                            <button className="dropdown-item" onClick={() => { onNavigate('dashboard'); setDropdownOpen(false); }}>Dashboard</button>
                                            <button className="dropdown-item" onClick={() => { onNavigate('profile'); setDropdownOpen(false); }}>My Profile</button>
                                            <button className="dropdown-item" onClick={() => { onNavigate('earnings'); setDropdownOpen(false); }}>My Earnings</button>
                                            <button className="dropdown-item" onClick={() => { onNavigate('myBookings'); setDropdownOpen(false); }}>My Bookings</button>
                                        </>
                                    )}
                                     {userRole === 'collector' && (
                                        <>
                                            <button className="dropdown-item" onClick={() => { onNavigate('collectorDashboard'); setDropdownOpen(false); }}>Dashboard</button>
                                            <button className="dropdown-item" onClick={() => { onNavigate('collectorEarnings'); setDropdownOpen(false); }}>My Earnings</button>
                                        </>
                                    )}
                                    {userRole === 'admin' && (
                                        <>
                                            <button className="dropdown-item" onClick={() => { onNavigate('dashboard'); setDropdownOpen(false); }}>User Dashboard</button>
                                            <div className="dropdown-divider"></div>
                                            <button className="dropdown-item" onClick={() => { onNavigate('adminAnalytics'); setDropdownOpen(false); }}>Admin Analytics</button>
                                            <button className="dropdown-item" onClick={() => { onNavigate('adminUserManagement'); setDropdownOpen(false); }}>User Management</button>
                                        </>
                                    )}
                                    <div className="dropdown-divider"></div>
                                    <button onClick={handleLogout} className="dropdown-item">Log Out</button>
                                 </div>
                             )}
                        </div>
                    ) : (
                        <button onClick={() => onNavigate('login')} className="navbar-button">Login / Signup</button>
                    )}
                </div>
            </div>
        </nav>
    );
};


// Role Selection Page - shown on login page
const RoleSelectionPage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => (
  <div className="form-container-wrapper">
    <div className="form-container">
      <h1>Welcome to ScrapKart</h1>
      <p>Choose your role to login</p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '30px' }}>
        <button onClick={() => onNavigate('login')} style={{ padding: '15px 30px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
          👤 User Login
        </button>
        <button onClick={() => onNavigate('login')} style={{ padding: '15px 30px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}>
          🏭 Collector Login
        </button>
        <button onClick={() => onNavigate('login')} style={{ padding: '15px 30px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px' }}>
          👨‍💼 Admin Login
        </button>
      </div>
    </div>
  </div>
);

// --- Pages ---
const HomePage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => (
    <>
        <header className="hero">
            <h1>Turn Your Scrap Into Cash, Effortlessly.</h1>
            <p>Schedule a pickup for your recyclable scrap and get paid instantly. Good for your wallet, great for the planet.</p>
            <button onClick={() => onNavigate('booking')}>Schedule a Pickup</button>
        </header>
        <div className="container">
            <QuickStartGuide onNavigate={onNavigate} />
        </div>
        <section className="how-it-works-section">
            <h2 className="section-title">How It Works</h2>
            <div className="steps-container">
                <div className="step-card">
                    <div className="step-icon">📅</div>
                    <h3>1. Book a Pickup</h3>
                    <p>Select your scrap type, estimate the weight, and choose a convenient date and time.</p>
                </div>
                <div className="step-card">
                    <div className="step-icon">⚖️</div>
                    <h3>2. We Collect & Weigh</h3>
                    <p>Our collector arrives at your doorstep, weighs the items accurately using a digital scale.</p>
                </div>
                <div className="step-card">
                    <div className="step-icon">💸</div>
                    <h3>3. Get Paid Instantly</h3>
                    <p>Receive your payment on the spot via UPI or cash. It's that simple!</p>
                </div>
            </div>
        </section>
        <section className="collector-cta-section">
            <div className="container">
                <h2>Are You a Scrap Collector?</h2>
                <p>Join our network of professional collectors. Enjoy flexible working hours, optimized routes, and transparent earnings. Help us build a greener planet.</p>
                <button onClick={() => onNavigate('login')}>Collector Login & Portal</button>
            </div>
        </section>
    </>
);

const LoginPage = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, signInWithGoogle } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            notificationService.showToast('Login successful! Welcome back.', 'success');
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message || 'Invalid credentials. Please try again.');
            notificationService.showToast('Login failed. Please check your credentials.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGoogleSignIn = async () => {
        setError('');
        setIsLoading(true);
        try {
            await signInWithGoogle();
            notificationService.showToast('Signed in with Google successfully!', 'success');
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message || 'Google Sign-In failed. Please try again.');
            notificationService.showToast(err.message || 'Google Sign-In failed.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container-wrapper">
            <div className="form-container">
                <h1>Welcome Back!</h1>
                <p>Log in to manage your pickups and earnings.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g., user@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? <div className="spinner spinner-button" style={{width: 16, height: 16, borderWidth: 2}}></div> : 'Log In'}
                    </button>
                </form>
                <div className="or-divider">or</div>
                <button onClick={handleGoogleSignIn} className="google-btn" disabled={isLoading}>
                    Sign in with Google
                </button>
                 <div className="login-hints">
                    <p><strong>Demo Credentials:</strong></p>
                    <p><strong>User:</strong> user@example.com / password</p>
                    <p><strong>Collector:</strong> collector@scrapkart.com / collectorpass</p>
                    <p><strong>Admin:</strong> admin@scrapkart.com / adminpass</p>
                </div>
            </div>
        </div>
    );
};

const DashboardPage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const { user, userRole } = useAuth();
    const userName = user?.displayName || user?.email?.split('@')[0] || 'User';
    
    return (
        <div className="container">
            <div className="dashboard-header">
                <h1>Welcome, {userName.charAt(0).toUpperCase() + userName.slice(1)}!</h1>
                <button onClick={() => onNavigate('booking')}>Book New Pickup</button>
            </div>
            <div className="dashboard-grid">
                <div className="dashboard-card" onClick={() => onNavigate('myBookings')}>
                    <h3>My Bookings</h3>
                    <p>View and manage your past and upcoming pickups.</p>
                </div>
                 <div className="dashboard-card" onClick={() => onNavigate('recurringBooking')}>
                    <h3>Recurring Pickups</h3>
                    <p>Schedule weekly or monthly automated pickups.</p>
                </div>
                <div className="dashboard-card" onClick={() => onNavigate('earnings')}>
                    <h3>My Earnings</h3>
                    <p>See detailed stats about your earnings and impact.</p>
                </div>
                <div className="dashboard-card" onClick={() => onNavigate('profile')}>
                    <h3>My Profile</h3>
                    <p>Update your personal information and address.</p>
                </div>
                 <div className="dashboard-card" onClick={() => onNavigate('trackOrder')}>
                    <h3>Track Live Pickup</h3>
                    <p>See your collector's location in real-time.</p>
                </div>
                 <div className="dashboard-card" onClick={() => onNavigate('checkout')}>
                    <h3>Checkout Demo</h3>
                    <p>Test our new payment integration system.</p>
                </div>
                 {userRole === 'admin' && (
                    <div className="dashboard-card" onClick={() => onNavigate('routeOptimization')}>
                        <h3>Route Optimization</h3>
                        <p>Plan the most efficient route for collections.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const BookingPage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const { user } = useAuth();
    const [scrapType, setScrapType] = useState('Paper');
    const [quantity, setQuantity] = useState(10);
    const [address, setAddress] = useState('');
    const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
    const [photoUrl, setPhotoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090 });

    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (mapRef.current) return;
        
        const map = L.map('map').setView([location.lat, location.lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);
        
        const marker = L.marker([location.lat, location.lng], { draggable: true }).addTo(map);
        marker.on('dragend', function (event: any) {
            const position = event.target.getLatLng();
            setLocation({ lat: position.lat, lng: position.lng });
            console.log(`New location: ${position.lat}, ${position.lng}`);
        });

        mapRef.current = map;
    }, [location]);

    const estimatedPrice = useMemo(() => {
        return (MOCK_PRICES[scrapType] || 0) * quantity;
    }, [scrapType, quantity]);

    const handleConfirmBooking = async () => {
        if (!user) {
            notificationService.showToast('You must be logged in to book a pickup.', 'error');
            return;
        }
        setIsLoading(true);
        try {
            const pickupData = {
                scrapType,
                quantity,
                address,
                pickupDate,
                photoUrl,
                location,
                userId: user.uid,
                userName: user.displayName || user.email,
                userEmail: user.email,
                status: 'Pending',
                estimatedPrice,
            };
            await createPickupRequest(pickupData);
            notificationService.showToast('Booking created successfully!', 'success');
            setModalOpen(false);
            onNavigate('myBookings');
        } catch (error: any) {
            console.error("Booking failed:", error);
            notificationService.showToast(error.message || 'Booking failed. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container wide" style={{ margin: '0 auto', textAlign: 'left' }}>
                <div className="booking-form-header">
                    <button className="back-button" onClick={() => onNavigate('dashboard')} aria-label="Go back to dashboard">&larr;</button>
                    <h1>Schedule a Pickup</h1>
                </div>
                <div className="price-estimator">
                    <p>Estimated Price: ₹{estimatedPrice.toFixed(2)}</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); setModalOpen(true); }}>
                    <div className="form-group">
                        <label htmlFor="scrapType">Type of Scrap</label>
                        <select id="scrapType" value={scrapType} onChange={e => setScrapType(e.target.value)}>
                            {Object.keys(MOCK_PRICES).map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity" style={{display: 'flex', alignItems: 'center'}}>
                            Approx. Quantity (in kg)
                            <HelpTooltip text="This is just an estimate. The final weight will be determined by the collector." />
                        </label>
                        <input type="number" id="quantity" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value, 10) || 0)} placeholder="e.g., 10" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Pickup Address</label>
                        <textarea id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your full address including landmarks" required></textarea>
                         <p className="form-help-text">Please ensure the address is correct for a smooth pickup.</p>
                    </div>
                     <div className="form-group">
                        <label>Pin Location on Map</label>
                        <div id="map" className="map-container"></div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="pickupDate">Preferred Pickup Date</label>
                        <input type="date" id="pickupDate" value={pickupDate} onChange={e => setPickupDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="form-group">
                         <label>Upload Photo (Optional)</label>
                         <ImageUpload onUploadComplete={(url) => setPhotoUrl(url)} />
                         <p className="form-help-text">Uploading a photo helps the collector identify the scrap easily.</p>
                    </div>
                    <button type="submit" style={{ width: '100%' }}>Proceed to Confirmation</button>
                </form>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Confirm Your Booking">
                <div className="booking-summary">
                    <p><strong>Scrap Type:</strong> {scrapType}</p>
                    <p><strong>Quantity:</strong> ~{quantity} kg</p>
                    <p><strong>Address:</strong> {address}</p>
                    <p><strong>Date:</strong> {pickupDate}</p>
                    <div className="summary-price">
                        <p>Estimated Payout</p>
                        <p>₹{estimatedPrice.toFixed(2)}</p>
                    </div>
                </div>
                <div className="modal-actions">
                     <button className="secondary-button" onClick={() => setModalOpen(false)} disabled={isLoading}>Cancel</button>
                    <button onClick={handleConfirmBooking} disabled={isLoading}>
                         {isLoading ? <div className="spinner spinner-button" style={{width:16, height:16, borderWidth:2}}></div> : 'Confirm Pickup'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

const EarningsPage = () => {
    // This page would require fetching completed pickups and summing up earnings.
    // For now, we'll keep it simple.
    return (
        <div className="container">
             <div className="page-header">
                <h1>My Earnings</h1>
                <p>An overview of your eco-friendly contributions. (Feature in development)</p>
            </div>
             <div className="stats-grid">
                <div className="stat-card">
                    <p className="stat-card-value">₹--.--</p>
                    <p className="stat-card-label">Total Earnings</p>
                </div>
                <div className="stat-card">
                    <p className="stat-card-value">-- kg</p>
                    <p className="stat-card-label">Items Recycled</p>
                </div>
                <div className="stat-card">
                    <p className="stat-card-value">-- kg</p>
                    <p className="stat-card-label">CO₂ Saved</p>
                </div>
            </div>
        </div>
    )
};


const MyBookingsPage = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            getPickupsForUser(user.uid)
                .then(data => {
                    setBookings(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    notificationService.showToast('Failed to fetch bookings.', 'error');
                    setIsLoading(false);
                });
        }
    }, [user]);

    const handleRatingSubmit = async (bookingId: string, rating: number, feedback: string) => {
        try {
            await updatePickupRating(bookingId, rating, feedback);
            setBookings(prevBookings => 
                prevBookings.map(b => b.id === bookingId ? { ...b, rated: true, rating, feedback } : b)
            );
            notificationService.showToast('Thank you for your feedback!', 'success');
        } catch (error) {
            notificationService.showToast('Failed to submit feedback.', 'error');
        }
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => 
            booking.scrapType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [bookings, searchTerm]);

    if (isLoading) {
        return <div className="container"><LoadingSpinner size="large" /></div>;
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>My Bookings</h1>
                <p>Review your booking history and provide feedback.</p>
            </div>

            <div className="search-container">
                <input 
                    type="text" 
                    className="search-input"
                    placeholder="Search by scrap type or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {filteredBookings.length > 0 ? filteredBookings.map(booking => (
                <div key={booking.id} className="booking-list-item">
                    <div className="booking-details">
                        <div><strong>Booking ID</strong><p>#{booking.id.slice(0, 7)}</p></div>
                        <div><strong>Date</strong><p>{booking.pickupDate}</p></div>
                        <div><strong>Scrap Type</strong><p>{booking.scrapType}</p></div>
                        <div><strong>Status</strong><p><span className={`status-badge status-${booking.status}`}>{booking.status}</span></p></div>
                    </div>
                    {booking.status === 'Completed' && (
                        <div className="review-section">
                            {booking.rated ? (
                                <div>
                                    <p>Your Rating:</p>
                                    <div className="star-rating">
                                        {[5, 4, 3, 2, 1].map(star => <label key={star} style={{color: star <= booking.rating ? 'var(--secondary-color)' : '#ccc'}}>&#9733;</label>)}
                                    </div>
                                </div>
                            ) : (
                                <Rating 
                                    bookingId={booking.id}
                                    onSubmit={handleRatingSubmit}
                                />
                            )}
                        </div>
                    )}
                </div>
            )) : (
                 <div className="no-results-message">
                    <p>No bookings found.</p>
                </div>
            )}
        </div>
    );
};

const GenericPage = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="container">
        <div className="page-header">
            <h1>{title}</h1>
        </div>
        <div>{children}</div>
    </div>
);


const App = () => {
    const { user, userRole, loading } = useAuth();
    const [page, setPage] = useState<Page>('home');
    const [showOnboarding, setShowOnboarding] = useState(false);
    
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('SW registered: ', registration);
                }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
            });
        }
    }, []);
    
    useEffect(() => {
        // Show onboarding only once after first login
        if (user && !localStorage.getItem('hasSeenOnboarding')) {
            setShowOnboarding(true);
        }
    }, [user]);

    const handleLoginSuccess = () => {
        // The AuthContext will provide the userRole, and we navigate based on that
        // This is a bit of a race condition, so we listen to userRole change
    };
    
    useEffect(() => {
        if (user) {
            if (userRole === 'collector') setPage('collectorDashboard');
            else setPage('dashboard');
        } else {
            setPage('home');
        }
    }, [user, userRole]);


    const handleNavigate = (targetPage: Page) => {
        setPage(targetPage);
    };

    const handleOnboardingFinish = () => {
        setShowOnboarding(false);
        localStorage.setItem('hasSeenOnboarding', 'true');
    };

    const renderPage = () => {
        const isLoggedIn = !!user;
        const isUser = userRole === 'user';
        const isCollector = userRole === 'collector';
        const isAdmin = userRole === 'admin';
        
        const protectedPages: Page[] = ['dashboard', 'booking', 'profile', 'earnings', 'myBookings', 'recurringBooking', 'trackOrder', 'checkout', 'collectorDashboard', 'collectorEarnings', 'adminAnalytics', 'adminUserManagement', 'routeOptimization'];

        if (loading) {
            return <div className="spinner-container full-page"><LoadingSpinner size="large" /></div>;
        }

        if (!isLoggedIn && protectedPages.includes(page)) {
             return <LoginPage onLoginSuccess={handleLoginSuccess} />;
        }

        switch (page) {
            case 'home': return isLoggedIn ? <HomePage onNavigate={handleNavigate} /> : <RoleSelectionPage onNavigate={handleNavigate} />;
            case 'login': return <LoginPage onLoginSuccess={handleLoginSuccess} />;
            // User pages
            case 'dashboard': return <DashboardPage onNavigate={handleNavigate} />;
            case 'booking': return <BookingPage onNavigate={handleNavigate} />;
            case 'profile': return <UserProfile />;
            case 'earnings': return <EarningsPage />;
            case 'myBookings': return <MyBookingsPage />;
            case 'recurringBooking': return <RecurringBooking onNavigate={handleNavigate} />;
            case 'trackOrder': return <RealTimeTracker />;
            case 'checkout': return (
                <div className="container">
                    <div className="page-header">
                        <h1>Checkout</h1>
                        <p>Complete your payment securely.</p>
                    </div>
                    <PaymentIntegration />
                </div>
            );
            // Collector Pages
            case 'collectorDashboard': return isCollector || isAdmin ? <CollectorDashboard /> : <DashboardPage onNavigate={handleNavigate} />;
            case 'collectorEarnings': return isCollector || isAdmin ? <CollectorEarnings /> : <DashboardPage onNavigate={handleNavigate} />;
            // Admin Pages
            case 'adminAnalytics': return isAdmin ? <Analytics /> : <DashboardPage onNavigate={handleNavigate} />;
            case 'adminUserManagement': return isAdmin ? <AdminUserManagement /> : <DashboardPage onNavigate={handleNavigate} />;
            case 'routeOptimization': return isAdmin ? <CollectorRouteOptimization /> : <DashboardPage onNavigate={handleNavigate} />;
            // Generic Pages
            case 'faq': return <FAQPage />;
            case 'howItWorks': return <GenericPage title="How It Works">Content coming soon.</GenericPage>;
            // FIX: Corrected closing tag from </Generic-page> to </GenericPage>
            case 'about': return <GenericPage title="About Us">Content coming soon.</GenericPage>;
            // FIX: Corrected closing tag from </Generic-page> to </GenericPage>
            case 'contact': return <GenericPage title="Contact Us">Content coming soon.</GenericPage>;
            default: return <HomePage onNavigate={handleNavigate} />;
        }
    };

    return (
        <>
            <ToastContainer />
            {showOnboarding && <Onboarding onFinish={handleOnboardingFinish} />}
            <Navbar onNavigate={handleNavigate} />
            <main>
                <div className="main-content-wrapper">
                    <div className="page-content">
                        {renderPage()}
                    </div>
                    {user && userRole === 'user' && <InstructionsPanel currentPage={page} />}
                </div>
            </main>
            {user && <ChatSupport />}
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
