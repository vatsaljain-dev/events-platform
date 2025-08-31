# LocalEventsApp

A full-stack project with **Backend API**, **Frontend Dashboard**, and **Mobile App** built using React Native + Expo.

---

## 🏗️ Project Overview

This project consists of three parts:

1. **Backend** – Node.js/Express API  
   - Handles events, users, and chat data.  
   - Provides REST endpoints for the app & dashboard.  
   - Hosted at: `https://events-platform-backend-mkn0.onrender.com`.

2. **Frontend (Admin Dashboard)** – React.js Web App  
   - Used by admins to manage events, users, and chat.  
   - Connects to the same backend API.  
   - Hoste at: `https://localeventsapp-admin-dashboard.netlify.app`

3. **Mobile App (LocalEventsApp)** – React Native + Expo  
   - User-facing app to view, create, and chat about events.  
   - Has Login and Signup flow.  
   - Consumes the backend API for event data and chat.  

---

## 🚀 Getting Started

### 1. App

1. **Clone the repository**
```bash
git clone https://github.com/vatsaljain-dev/events-platform.git
cd LocalEventsApp
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start the app**
```bash
npx expo start
```

This will start the Expo development server.  
Use **Expo Go** app on your phone or an emulator to preview.

---

## 📂 Project Structure
```
LocalEventsApp/
  backend/         # Node.js + Express backend (events, users, chat API)
  dashboard/       # React.js admin dashboard
  app/             # React Native (Expo) mobile app
    _layout.js
    login.js
    signup.js
    events.js
    chat/[id].js
    profile.js
  firebase/        # Firebase setup for auth & notifications
    config.js
  package.json
  README.md
```

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express, MongoDB  
- **Frontend**: React.js (Admin Dashboard)  
- **Mobile App**: React Native (Expo)  
- **Auth & Notifications**: Firebase  

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
