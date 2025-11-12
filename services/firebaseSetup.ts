/**
 * Firebase Setup Service
 * This service initializes Firebase with test users and sample data
 */

import { db } from '../config/firebase';
import { setDoc, doc } from 'firebase/firestore';

export const setupFirebaseData = async () => {
  try {
    // Define test users with their UIDs
    const testUsers = [
      {
        uid: 'C20YZpChxPbN_test_user',
        email: 'user@example.com',
        displayName: 'John User',
        photoURL: null,
        role: 'user' as const,
        createdAt: new Date(),
      },
      {
        uid: 'yXnG0SkrATRR_test_collector',
        email: 'collector@scrapkart.com',
        displayName: 'Collector Name',
        photoURL: null,
        role: 'collector' as const,
        createdAt: new Date(),
      },
      {
        uid: 'C20YZpChxPbN_test_admin',
        email: 'admin@scrapkart.com',
        displayName: 'Admin Name',
        photoURL: null,
        role: 'admin' as const,
        createdAt: new Date(),
      },
    ];

    // Add users to Firestore
    for (const user of testUsers) {
      try {
        await setDoc(doc(db, 'users', user.uid), user);
        console.log(`Created user: ${user.email}`);
      } catch (error) {
        console.log(`User ${user.email} setup: ${error}`);
      }
    }

    console.log('Firebase setup completed!');
  } catch (error) {
    console.error('Firebase setup error:', error);
  }
};
