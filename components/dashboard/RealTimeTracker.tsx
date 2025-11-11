import React, { useEffect, useRef, useState } from 'react';

// Inform TypeScript about the global Leaflet object 'L'
declare var L: any;

const RealTimeTracker = () => {
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [eta] = useState(15); // Static ETA for demo

    // Initial and target coordinates for simulation
    const initialPosition: [number, number] = [28.6139, 77.2090]; // Delhi
    const targetPosition: [number, number] = [28.6304, 77.2177]; // Connaught Place

    useEffect(() => {
        if (mapRef.current) return; // Initialize map only once

        const map = L.map('realtime-map').setView(initialPosition, 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Custom icon for the collector's vehicle
        const truckIcon = L.divIcon({
            html: '🚚',
            className: 'truck-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        const marker = L.marker(initialPosition, { icon: truckIcon }).addTo(map);
        
        // Add a marker for the destination
        L.marker(targetPosition).addTo(map).bindPopup("Your Location");

        mapRef.current = map;
        markerRef.current = marker;

        // Add custom style for the icon
        const style = document.createElement('style');
        style.innerHTML = `
            .truck-icon {
                font-size: 24px;
                text-align: center;
                line-height: 40px;
                background: var(--surface-color);
                border-radius: 50%;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
        `;
        document.head.appendChild(style);

    }, []);

    useEffect(() => {
        // Simulate marker movement
        const interval = setInterval(() => {
            if (!markerRef.current) return;
            
            const currentLatLng = markerRef.current.getLatLng();
            const newLat = currentLatLng.lat + (targetPosition[0] - currentLatLng.lat) * 0.1;
            const newLng = currentLatLng.lng + (targetPosition[1] - currentLatLng.lng) * 0.1;

            // Stop simulation when close to the target
            if (Math.abs(newLat - targetPosition[0]) < 0.0001 && Math.abs(newLng - targetPosition[1]) < 0.0001) {
                markerRef.current.setLatLng(targetPosition);
                clearInterval(interval);
                 // In a real app, you would notify the user
            } else {
                 markerRef.current.setLatLng([newLat, newLng]);
                 mapRef.current.panTo([newLat, newLng]);
            }
        }, 2000);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    return (
        <div className="container">
            <div className="page-header">
                <h1>Live Pickup Tracker</h1>
                <p>Watch your collector's progress in real-time.</p>
            </div>
            <div className="stat-card" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <h3>Estimated Time of Arrival: <strong>{eta} minutes</strong></h3>
                <p>Your collector is on the way. You will be notified upon arrival.</p>
            </div>
            <div id="realtime-map" className="map-container" style={{ height: '500px' }}></div>
        </div>
    );
};

export default RealTimeTracker;
