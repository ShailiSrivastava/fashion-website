# SAMAYRA | Luxury Fashion Platform

A high-end digital fashion destination featuring a magazine-style Lookbook, curated collections, a personalized fit quiz, and a Virtual Closet. 

## 🚀 Features

- **Pixel-Perfect Hero UI**: A modern, side-by-side hero layout featuring Playfair Display typography overlapping absolute/grid fashion cards.
- **Virtual Closet**: Users can save their favorite pieces to their personalized closet. 
- **Hybrid Data Architecture**: Robust backend handling fallback products through `local_products.json` combined with MongoDB. Mongoose schemas are optimized to handle both standard ObjectIds and local string IDs seamlessly.
- **Enhanced Security & Performance**: Includes secure CORS origin whitelisting, stripped hardcoded API strings for dynamic environments, layout-thrashing prevention in DOM rendering, and XSS sanitization.
- **Image Scrapers**: Built-in scraper utilities for pulling high-quality fashion images (`scrape_ddg.js`, `scrape_pexels.js`, `scrape_pinterest.js`, `scrape_unsplash.js`, etc.).

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3 
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas) / Mongoose
- **Typography**: Playfair Display (Serif) & Poppins (Sans-serif)

## ⚙️ How to Run the Platform

Follow these steps to get the full Samayra experience running locally:

### 1. Start the Backend Server
1. Open your terminal in the `backend` folder.
2. Install dependencies if you haven't already:
   ```bash
   npm install
   ```
3. Run the backend server:
   ```bash
   node server.js
   # or npm start
   ```
   *Note: Continues to run securely on port `5000` (`http://localhost:5000`). It features a built-in fail-safe that uses local high-res photos if the cloud database is unreachable or missing items.*

### 2. Launch the Frontend
1. Open a new terminal in the `frontend` folder.
2. Serve the static files (e.g., using `http-server` or `live-server`):
   ```bash
   npx http-server -p 5500
   ```
   *Note: The frontend is configured to communicate with the global `API_BASE` locally.*
3. Open `http://localhost:5500` in your browser.

---

## 📸 Local Image Sync (The "Lock" Feature)
If you want to ensure all collection photos are stored permanently on your machine (for zero-latency loading):

1. Open your terminal in the `backend` folder.
2. Run:
   ```bash
   node imageDownloader.js
   ```
3. This utility will download and store premium model photos into `../frontend/assets/products/` and update the `local_products.json` manifest. You can also seed data using `node seed.js`.

---

## 🏛️ Project Architecture
- **Lookbook**: A multi-spread editorial magazine layout (`lookbook.html`).
- **Collection**: A high-impact product gallery (`collection.html`).
- **Hero/Landing**: The redesigned pixel-perfect entry point (`index.html`).
- **Fit Quiz**: A personalized style recommender with silhouette analysis (`fit.html`).
- **Virtual Closet**: Profile management and saved items page (`profile.html`).

---
© 2026 SAMAYRA — Luxury Fashion House
