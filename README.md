# SAMAYRA | Luxury Fashion Platform

A high-end digital fashion destination featuring a magazine-style Lookbook, curated collections, and a personalized fit quiz.

## 🚀 How to Run the Platform

Follow these steps to get the full Samayra experience running locally:

### 1. Start the Backend Server
1. Open your terminal in the `backend` folder.
2. Run the command:
   ```bash
   npm start
   ```
   *Note: The server runs on `http://localhost:5000`. It features a built-in fail-safe that uses local high-res photos if the cloud database is unreachable.*

### 2. Launch the Frontend
1. Open your terminal in the `frontend` folder.
2. You can use any local server (like Live Server in VS Code) or run:
   ```bash
   npx live-server
   ```
3. Open `http://localhost:3000` (or the port provided) in your browser.

---

## 📸 Local Image Sync (The "Lock" Feature)
If you want to ensure all collection photos are stored permanently on your machine (for zero-latency loading):

1. Open your terminal in the `backend` folder.
2. Run:
   ```bash
   node imageDownloader.js
   ```
3. This will search, download, and store 15 premium model photos into `frontend/assets/products/` and create a `local_products.json` manifest.

---

## 🏛️ Project Architecture
- **Lookbook**: A multi-spread editorial magazine layout.
- **Collection**: A high-impact product gallery with sticky filter navigation.
- **Fit Quiz**: A personalized style recommender with silhouette analysis.
- **Virtual Closet**: Save your favorite pieces (requires login).

## 🛠️ Tech Stack
- **Frontend**: Vanilla JS, HTML5, Premium CSS3.
- **Backend**: Node.js, Express, MongoDB Atlas.
- **Typography**: Playfair Display (Serif) & Poppins (Sans-serif).

---
© 2026 SAMAYRA — Luxury Fashion House
