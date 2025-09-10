## 🏗️ Folder Overview

This folder consists of three parts:

**Frontend (Admin Dashboard)** – React.js Web App  
   - Used by admins to manage events, users, and create admins.  
   <!-- - ✅ Already hosted at: https://localeventsapp-admin-dashboard.netlify.app   -->


## 🚀 Getting Started

## 🖥️ Running Locally (Backend + Admin Dashboard)

By default, the backend and dashboard are already hosted, but you can also run them locally for development.

### ▶️ Run Backend Locally
1. Navigate to the backend folder:
   ```bash
   cd events-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node server.js
   ```
4. The backend will run at:
   ```
   http://localhost:4000
   ```

✅ Use `http://192.168.x.x:4000` (your LAN IP) when connecting from **Admin Dashboard**.

---

### ▶️ Run Admin Dashboard Locally
1. Navigate to the dashboard folder:
   ```bash
   cd admin-dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. The dashboard will run at:
   ```
   http://localhost:5173
   ```

---

Since backend and dashboard are already deployed, you only need to set up the **mobile app** locally.

1. Navigate to the app folder:
   ```bash
   cd LocalEventsApp
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the app:
   ```bash
   npx expo start
   ```

This will start the Expo development server.  
Use **Expo Go** app on your phone or an emulator to preview.

---

## 🔧 Backend Configuration (Local vs Hosted)

The **Admin Dashboard** need to point to the correct backend API.

### 📌 Admin Dashboard (`admin-dashboard/src/config.ts`)
**Local:**
```ts
const API_URL = "http://192.168.x.x:4000";
export default API_URL;
```

<!-- **Hosted (default):**
```ts
const API_URL = "https://events-platform-backend-mkn0.onrender.com";
export default API_URL;
``` -->

---

⚠️ **Important Notes:**  
- Always include `:4000` when using the local backend since it runs on **port 4000**.  
- Replace `192.168.x.x` with your actual **LAN IP** (find using `ifconfig` / `ipconfig`).  
- On **Expo Go**, you must use your **LAN IP**, not `localhost` or `127.0.0.1`.  
- For production builds, always use the **hosted backend** URL.  

---
