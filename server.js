require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// CTA API configuration
const CTA_API_KEY = process.env.CTA_API_KEY;
const CTA_BASE_URL = 'http://www.ctabustracker.com/bustime/api/v2';

// Northwestern University to Downtown Chicago routes
const ROUTES = [
    { id: '201', name: '201 Central/Sherman' },
    { id: '206', name: '206 Evanston Circulator' }
];

// API endpoint to get bus schedule
app.get('/api/schedule', async (req, res) => {
    try {
        const { start, end, time } = req.query;

        // Mock stops and times for demonstration
        const stops = {
            evanston_main: 'Evanston Main',
            evanston_north: 'Evanston North',
            evanston_south: 'Evanston South',
            downtown_union: 'Downtown Union Station',
            downtown_michigan: 'Michigan Ave',
            downtown_loop: 'The Loop',
        };

        // Generate mock bus departures every 10 minutes from 6:00 to 23:00
        const departures = [];
        for (let hour = 6; hour <= 23; hour++) {
            for (let min = 0; min < 60; min += 10) {
                departures.push({
                    hour,
                    min,
                });
            }
        }

        // Find the next departures after the selected time
        let selectedTime = time ? time : '06:00';
        const [selHour, selMin] = selectedTime.split(':').map(Number);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), selHour, selMin);

        // For each route, find the next 3 departures after the selected time
        let results = [];
        ROUTES.forEach(route => {
            let count = 0;
            for (let dep of departures) {
                const depTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), dep.hour, dep.min);
                if (depTime >= today && count < 3) {
                    // Mock travel time: 45 min
                    const arrTime = new Date(depTime.getTime() + 45 * 60000);
                    const minutes = Math.round((depTime - now) / 60000);
                    results.push({
                        route: route.id,
                        routeName: route.name,
                        departure: depTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        arrival: arrTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        minutes: minutes < 0 ? 0 : minutes,
                        start: stops[start] || stops['evanston_main'],
                        end: stops[end] || stops['downtown_union'],
                    });
                    count++;
                }
            }
        });

        res.json(results);
    } catch (error) {
        console.error('Error fetching bus schedule:', error);
        res.status(500).json({ error: 'Failed to fetch bus schedule' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 