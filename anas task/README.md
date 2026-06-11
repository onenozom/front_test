# Proctor Dashboard

A React + Tailwind remote monitoring dashboard for proctoring physical fitness tests. This project uses plain JavaScript and is optimized for dynamic camera grids, isolated trainee cards, and high-frequency updates.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/App.js` – Main orchestrator for test selection, timer, and mock live updates.
- `src/components/TraineeGrid.js` – Responsive grid layout for 1-10 cameras.
- `src/components/TraineeCard.js` – Isolated camera card with video placeholder and rep counter.
- `src/main.jsx` – App bootstrap.
- `src/index.css` – Tailwind imports and base global styling.

## Notes

- The live video is mocked with a `<video>` placeholder, ready to be connected to a real WebSocket/RTSP video stream package.
- The card update path is isolated using `React.memo`, stable object references, and refs for the rep counter.
