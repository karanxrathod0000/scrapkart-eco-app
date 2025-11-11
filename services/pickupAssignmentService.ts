import { CollectorPickup, PickupStatus } from '../types';
import notificationService from './notificationService';

const MOCK_PRICES: { [key: string]: number } = {
    Paper: 8, Plastic: 5, Metal: 25, Electronics: 15, Other: 3,
};

// FIX: Changed id from number to string and renamed pickupTime to pickupDate to match the CollectorPickup type.
let pickups: CollectorPickup[] = [
    { id: '101', customerName: 'Ravi Kumar', customerPhone: '9876543210', address: '12B, Karol Bagh, New Delhi', location: { lat: 28.65, lng: 77.21 }, scrapType: 'Electronics', estimatedWeight: 15, pickupDate: '10:00 AM', status: 'Assigned', estimatedPrice: 225 },
    { id: '102', customerName: 'Priya Sharma', customerPhone: '9876543211', address: 'C-45, Lajpat Nagar, New Delhi', location: { lat: 28.56, lng: 77.24 }, scrapType: 'Metal', estimatedWeight: 20, pickupDate: '11:30 AM', status: 'Accepted', estimatedPrice: 500 },
    { id: '103', customerName: 'Amit Singh', customerPhone: '9876543212', address: '88, Hauz Khas Village, New Delhi', location: { lat: 28.55, lng: 77.20 }, scrapType: 'Paper', estimatedWeight: 50, pickupDate: '02:00 PM', status: 'Assigned', estimatedPrice: 400 },
];

let nextPickupId = 104;
const subscribers: Function[] = [];

const notifySubscribers = () => {
    subscribers.forEach(callback => callback(pickups));
};

// Simulate a new pickup being assigned every 30 seconds
setInterval(() => {
    const newPickup: CollectorPickup = {
        // FIX: Changed id from number to string and renamed pickupTime to pickupDate to match the CollectorPickup type.
        id: (nextPickupId++).toString(),
        customerName: 'Suman Gupta',
        customerPhone: '9876543213',
        address: '21, Mayur Vihar, New Delhi',
        location: { lat: 28.60, lng: 77.29 },
        scrapType: 'Plastic',
        estimatedWeight: 25,
        pickupDate: '04:00 PM',
        status: 'Assigned',
        estimatedPrice: 125,
    };
    pickups = [...pickups, newPickup];
    notificationService.showToast(`New pickup assignment #${newPickup.id} received!`, 'info');
    notifySubscribers();
}, 30000);


const pickupAssignmentService = {
    getPickupsForCollector(collectorId: string): Promise<CollectorPickup[]> {
        console.log(`Fetching pickups for ${collectorId}`);
        return Promise.resolve(pickups);
    },

    // FIX: Changed pickupId type from number to string to allow for correct comparison with pickup.id.
    updatePickupStatus(pickupId: string, status: PickupStatus, details?: { finalPrice?: number }): Promise<CollectorPickup> {
        return new Promise((resolve, reject) => {
            let updatedPickup: CollectorPickup | undefined;
            pickups = pickups.map(p => {
                if (p.id === pickupId) {
                    updatedPickup = { ...p, status, ...details };
                    return updatedPickup;
                }
                return p;
            });

            if (updatedPickup) {
                // Simulate notifying the user
                if(status === 'Accepted') notificationService.showToast(`Pickup #${pickupId} confirmed. The user has been notified.`, 'success');
                if(status === 'InProgress') notificationService.showToast(`Journey started for pickup #${pickupId}.`, 'info');
                if(status === 'Completed') notificationService.showToast(`Pickup #${pickupId} completed successfully. Earnings updated.`, 'success');
                
                notifySubscribers();
                resolve(updatedPickup);
            } else {
                reject(new Error('Pickup not found'));
            }
        });
    },

    calculatePrice(scrapType: string, weight: number): number {
        return (MOCK_PRICES[scrapType] || MOCK_PRICES['Other']) * weight;
    },
    
    // Observer pattern to allow components to listen for real-time updates
    subscribe(callback: (updatedPickups: CollectorPickup[]) => void): () => void {
        subscribers.push(callback);
        // Return an unsubscribe function
        return () => {
            const index = subscribers.indexOf(callback);
            if (index > -1) {
                subscribers.splice(index, 1);
            }
        };
    }
};

export default pickupAssignmentService;