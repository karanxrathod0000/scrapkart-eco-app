import { db, storage, auth } from '../config/firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    query,
    where,
    serverTimestamp,
    onSnapshot,
    Timestamp,
    orderBy,
    getCountFromServer,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { UserRole } from '../types';

export const MOCK_PRICES: { [key: string]: number } = {
    Paper: 8, Plastic: 5, Metal: 25, Electronics: 15, Other: 3,
};

// --- User Management ---

export const getUserProfile = async (userId: string) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() };
        }
        throw new Error("User not found");
    } catch (error) {
        console.error("Error getting user profile: ", error);
        throw error;
    }
};

export const updateUserProfile = async (userId: string, data: any) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, data);
    } catch (error) {
        console.error("Error updating user profile: ", error);
        throw error;
    }
};

// --- Pickup Request Management ---

export const createPickupRequest = async (pickupData: any) => {
    try {
        await addDoc(collection(db, 'pickups'), {
            ...pickupData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error creating pickup request: ", error);
        throw error;
    }
};

export const getPickupsForUser = async (userId: string) => {
    try {
        const q = query(collection(db, 'pickups'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting user pickups: ", error);
        throw error;
    }
};

export const updatePickupStatus = async (pickupId: string, status: string, details?: any) => {
    try {
        const pickupDocRef = doc(db, 'pickups', pickupId);
        await updateDoc(pickupDocRef, {
            status,
            ...details,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating pickup status: ", error);
        throw error;
    }
};

export const updatePickupRating = async (pickupId: string, rating: number, feedback: string) => {
    try {
        const pickupDocRef = doc(db, 'pickups', pickupId);
        await updateDoc(pickupDocRef, {
            rating,
            feedback,
            rated: true,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating pickup rating: ", error);
        throw error;
    }
};


// --- Collector Functions ---

export const listenToNewPickups = (callback: (pickups: any[]) => void) => {
    const q = query(collection(db, 'pickups'), where('status', 'in', ['Pending', 'Assigned', 'Rejected']));
    return onSnapshot(q, (querySnapshot) => {
        const pickups = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(pickups);
    });
};

export const listenToActivePickup = (collectorId: string, callback: (pickup: any | null) => void) => {
    const q = query(collection(db, 'pickups'), 
        where('collectorId', '==', collectorId),
        where('status', 'in', ['Accepted', 'InProgress', 'Collected'])
    );
     return onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
            const pickupDoc = querySnapshot.docs[0];
            callback({ id: pickupDoc.id, ...pickupDoc.data() });
        } else {
            callback(null);
        }
    });
};

export const getCompletedPickupsForCollector = async (collectorId: string) => {
    try {
        const q = query(
            collection(db, 'pickups'), 
            where('collectorId', '==', collectorId),
            where('status', '==', 'Completed')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting completed pickups: ", error);
        throw error;
    }
};

export const assignPickupToCollector = async (pickupId: string, collectorId: string) => {
    await updatePickupStatus(pickupId, 'Assigned', { collectorId });
};


// --- Admin Functions ---

export const getAllUsers = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting all users: ", error);
        throw error;
    }
};

export const updateUserRoleAndStatus = async (userId: string, role: UserRole, status: string) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, { role, status });
    } catch (error) {
        console.error("Error updating user role/status: ", error);
        throw error;
    }
};

export const getAnalyticsData = async () => {
    try {
        const usersColl = collection(db, 'users');
        const pickupsColl = collection(db, 'pickups');

        const usersSnapshot = await getCountFromServer(usersColl);
        const totalBookingsSnapshot = await getCountFromServer(pickupsColl);
        
        const completedQuery = query(pickupsColl, where('status', '==', 'Completed'));
        const completedBookingsSnapshot = await getCountFromServer(completedQuery);
        const completedDocs = await getDocs(completedQuery);
        
        const totalRevenue = completedDocs.docs.reduce((sum, doc) => sum + (doc.data().finalPrice || 0), 0);

        return {
            totalUsers: usersSnapshot.data().count,
            totalBookings: totalBookingsSnapshot.data().count,
            completedBookings: completedBookingsSnapshot.data().count,
            totalRevenue,
        };
    } catch (error) {
        console.error("Error fetching analytics data:", error);
        throw error;
    }
};


// --- File Upload ---

export const uploadFile = (file: File, path: string, onProgress: (progress: number) => void) => {
    return new Promise<string>((resolve, reject) => {
        const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress(progress);
            },
            (error) => {
                console.error("Upload failed: ", error);
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
};
