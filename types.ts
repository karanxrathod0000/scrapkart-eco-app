// types.ts

export type Page = 
    'home' | 'login' | 'dashboard' | 'booking' | 'profile' | 
    'paymentHistory' | 'myBookings' | 'howItWorks' | 'about' | 'contact' | 
    'earnings' | 'adminAnalytics' | 'trackOrder' | 'checkout' | 
    'recurringBooking' | 'adminUserManagement' | 'routeOptimization' | 'faq' |
    'collectorDashboard' | 'collectorEarnings';

export type UserRole = 'user' | 'collector' | 'admin';

// FIX: Added 'Pending' to the PickupStatus type to match the statuses used in the application logic.
export type PickupStatus = 'Pending' | 'Assigned' | 'Accepted' | 'Rejected' | 'InProgress' | 'Collected' | 'Completed' | 'Cancelled';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    profilePicture?: string | null;
    address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    earnings?: number;
    statistics?: {
        totalBookings: number;
        completedBookings: number;
        cancelledBookings: number;
    };
}

export interface PickupRequest {
    id: string;
    userId: string;
    scrapType: string;
    quantity: number;
    pickupDate: string; // Should be ISO string
    pickupTime: string;
    address: string;
    location: {
        lat: number;
        lng: number;
    };
    photoUrl?: string | null;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    collectorId?: string | null;
    createdAt: number; // Timestamp
    updatedAt: number; // Timestamp
    estimatedPrice?: number;
    actualPrice?: number | null;
    rating?: number | null;
    feedback?: string | null;
    collectorNotes?: string | null;
}

export interface CollectorPickup {
    // FIX: Changed id from number to string to match Firestore document ID format.
    id: string;
    customerName: string;
    customerPhone: string;
    address: string;
    location: { lat: number; lng: number; };
    scrapType: string;
    estimatedWeight: number;
    // FIX: Changed pickupTime to pickupDate to match the property being used in components.
    pickupDate: string;
    status: PickupStatus;
    estimatedPrice: number;
    finalPrice?: number;
}