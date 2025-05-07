# NU Transit Tracker

A real-time bus tracking application for Northwestern University students traveling between Evanston and Downtown Chicago.

## Features

- Real-time bus arrival tracking
- Clean, modern interface
- Auto-refresh every 30 seconds
- Mobile-responsive design

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your CTA API key:
   ```
   PORT=3000
   CTA_API_KEY=your_cta_api_key_here
   ```
4. Start the server:
   ```bash
   node server.js
   ```
5. Open `http://localhost:3000` in your browser

## Technologies Used

- HTML5
- Tailwind CSS
- JavaScript
- Node.js
- Express
- CTA Bus Tracker API

## Note

This is an MVP version. The current implementation uses mock data. To use real CTA data, you'll need to:
1. Obtain a CTA Bus Tracker API key
2. Update the server.js file with actual stop IDs
3. Implement real API calls to the CTA Bus Tracker API 