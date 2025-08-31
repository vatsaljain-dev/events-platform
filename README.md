# LocalEventsApp

A full-stack project with **Backend API**, **Frontend Dashboard**, and **Mobile App** built using React Native + Expo.

---

## 🏗️ Project Overview

This project consists of three parts:

1. **Backend** – Node.js/Express API

   - Handles events, users, and chat data.
   - Provides REST endpoints for the app & dashboard.
   - ✅ Already hosted at:  
     `https://events-platform-backend-mkn0.onrender.com`

2. **Frontend (Admin Dashboard)** – React.js Web App

   - Used by admins to manage events, users, and create admin.
   - Connects to the same backend API.
   - ✅ Already hosted at:  
     `https://localeventsapp-admin-dashboard.netlify.app`

3. **Mobile App (LocalEventsApp)** – React Native + Expo
   - User-facing app to view, create, and chat about events.
   - Has Login and Signup flow.
   - Consumes the backend API for event data and chat.
   - ⚡ **Requires local setup (instructions below)**

---

## 🚀 Getting Started (Mobile App)

Since backend and dashboard are already deployed, you only need to set up the **mobile app** locally.

### 1. Clone the repository

```bash
git clone https://github.com/vatsaljain-dev/events-platform.git
cd LocalEventsApp
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the app

```bash
npx expo start
```

This will start the Expo development server.  
Use **Expo Go** app on your phone or an emulator to preview.

---

## 📂 Project Structure

```
events-platform/
  ├── events-backend/     # Node.js + Express backend (already hosted)
  ├── admin-dashboard/    # React.js admin dashboard (already hosted)
  └── LocalEventsApp/     # React Native (Expo) mobile app

  LocalEventsApp/
  app/
    _layout.js
    login.js
    signup.js
    events.js
    chat/[id].js
    profile.js
  components/
  utils/
  assets/
  package.json
  README.md

events-backend/
  ├── server.js        # Express server entry point
  ├── db.js            # Database logic (reads/writes db.json)
  ├── db.json          # Mock JSON database
  ├── .env             # Environment variables
  └── package.json

admin-dashboard/
  ├── src/
  │   ├── pages/
  │   │   ├── AdminDashboard.tsx
  │   │   └── AdminLogin.tsx
  │   ├── components/
  │   ├── assets/
  │   ├── App.tsx
  │   ├── config.ts
  │   └── main.tsx
  ├── public/
  ├── vite.config.ts
  └── package.json

```

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, JSON database (db.json)
- **Frontend**: React.js + Vite (Admin Dashboard)
- **Mobile App**: React Native (Expo)
- **Auth**: JWT
- **UI**: React Native Paper

---

## 🌐 Backend Endpoints (Examples)

- `POST /login` – User login
- `POST /signup` – User registration
- `GET /events` – Fetch all events
- `POST /events` – Create new event
- `GET /chat/:id` – Fetch chat by event

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push and create a PR

---

## 📜 License

This project is licensed under the MIT License.
