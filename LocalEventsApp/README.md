## 🏗️ Folder Overview

This Folder consists of three parts:

1. **Backend** – Node.js/Express API  
   - Handles events, users, and chat data.  
   - Provides REST endpoints for the app & dashboard.  
   <!-- - ✅ Already hosted at: https://events-platform-backend-mkn0.onrender.com   -->

2. **Mobile App (LocalEventsApp)** – React Native + Expo  
   - User-facing app to view, create, and chat about events.  
   - ⚡ Requires local setup  

---

## 🚀 Getting Started


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

✅ Use `http://192.168.x.x:4000` (your LAN IP) when connecting from **mobile app on Expo Go**.

---

## 📱 Running the Mobile App (Expo)

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

The **Mobile App** need to point to the correct backend API.
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

### 📌 Mobile App (`LocalEventsApp/utils/config.js`)
**Local:**
```js
const API_URL = "http://192.168.x.x:4000";
export default API_URL;
```

<!-- **Hosted (default):**
```js
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