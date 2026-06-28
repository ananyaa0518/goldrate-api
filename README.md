# Gold Rate Platform

A modern Gold Rate tracking platform built with React, TypeScript, Express, and Gold API integration.
## Live Demo

- **Frontend:** [https://cerulean-dragon-ca686b.netlify.app/](https://cerulean-dragon-ca686b.netlify.app/)
- **Backend API:** [https://goldrate-api.onrender.com/api/home](https://goldrate-api.onrender.com/api/home)

## Features

- Live Gold Rates (24K & 22K)
- Major Cities Gold Prices
- Interactive Price Trends
- Gold Value Calculator
- Smart Search & Suggestions
- Price Alert System
- Responsive Fintech UI
- Real-time Market Updates

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router
- Recharts
- Framer Motion
- TanStack Query

### Backend
- Node.js
- Express.js
- Axios

### Data Source
- Gold API

## Installation

### Backend

```bash
cd server
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:5001
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## Environment Variables

Create a `.env` file in the server directory:

```env
GOLD_API_KEY=your_api_key
PORT=5001
```

## API Endpoints

```http
GET  /api/home
GET  /api/cities/:city
GET  /api/search?q=
POST /api/calculator
POST /api/alerts
GET  /api/health
```

## License

MIT License
