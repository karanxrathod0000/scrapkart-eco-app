import React, { useEffect, useRef } from 'react';
// Fix: Import notificationService to show toast notifications.
import notificationService from '../../services/notificationService';

// Inform TypeScript about the global Leaflet object 'L'
declare var L: any;

const MOCK_PICKUPS = [
    { id: 1, address: 'India Gate, New Delhi', lat: 28.6129, lng: 77.2295 },
    { id: 2, address: 'Red Fort, New Delhi', lat: 28.6562, lng: 77.2410 },
    { id: 3, address: 'Qutub Minar, New Delhi', lat: 28.5245, lng: 77.1855 },
    { id: 4, address: 'Humayun\'s Tomb, New Delhi', lat: 28.5933, lng: 77.2507 },
    { id: 5, address: 'Lotus Temple, New Delhi', lat: 28.5535, lng: 77.2588 },
];

const CollectorRouteOptimization = () => {
    const mapRef = useRef<any>(null);
    const routeLayerRef = useRef<any>(null);

    useEffect(() => {
        if (mapRef.current) return; // Initialize map only once

        const map = L.map('route-map').setView([28.6139, 77.2090], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        MOCK_PICKUPS.forEach(pickup => {
            L.marker([pickup.lat, pickup.lng]).addTo(map)
                .bindPopup(`<b>Pickup #${pickup.id}</b><br>${pickup.address}`);
        });

        mapRef.current = map;
    }, []);

    const handleOptimizeRoute = () => {
        if (!mapRef.current) return;
        
        // Remove previous route if it exists
        if (routeLayerRef.current) {
            mapRef.current.removeLayer(routeLayerRef.current);
        }
        
        // Simulate optimized route (pre-defined order for demo)
        const optimizedOrder = [3, 5, 4, 1, 2];
        const routePoints = optimizedOrder.map(id => {
            const pickup = MOCK_PICKUPS.find(p => p.id === id);
            return [pickup!.lat, pickup!.lng];
        });

        // Draw polyline on the map
        const polyline = L.polyline(routePoints, { color: 'var(--primary-color)' }).addTo(mapRef.current);
        mapRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
        
        routeLayerRef.current = polyline;
        
        // Show notification
        notificationService.showToast('Route optimized successfully!', 'success');
    };

    const optimizedRouteDirections = [
        "Start at Qutub Minar",
        "Head east towards Lotus Temple",
        "Proceed north to Humayun's Tomb",
        "Continue northwest to India Gate",
        "Finish at Red Fort",
    ];

    return (
        <div className="container">
            <div className="page-header">
                <h1>Collector Route Optimization</h1>
                <p>Find the most efficient path for today's pickups.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div id="route-map" className="map-container" style={{ height: '600px', gridRow: '1 / span 2' }}></div>
                
                <div className="stat-card" style={{ textAlign: 'left' }}>
                    <h3 style={{marginTop: 0}}>Pickup Locations: {MOCK_PICKUPS.length}</h3>
                    <button onClick={handleOptimizeRoute} style={{width: '100%'}}>Optimize Route</button>
                </div>
                
                <div className="stat-card" style={{ textAlign: 'left' }}>
                     <h3 style={{marginTop: 0}}>Optimized Directions</h3>
                     <ol style={{paddingLeft: '1.5rem', margin: 0}}>
                        {optimizedRouteDirections.map((step, index) => (
                            <li key={index} style={{marginBottom: '0.5rem'}}>{step}</li>
                        ))}
                     </ol>
                </div>
            </div>
        </div>
    );
};

export default CollectorRouteOptimization;