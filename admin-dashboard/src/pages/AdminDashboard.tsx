import { useEffect, useState } from "react";
import AdminSignupForm from "../components/AdminSignupForm";
import API_URL from "../config";

type Review = {
  userId: string;
  rating: number;
  comment: string;
};

type Event = {
  id: string;
  title: string;
  location: string;
  time: string;
  attendees: string[];
  tags?: string[];
  reviews?: Review[];
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  bio?: string;
  interests?: string[];
  rating?: number;
};

export default function AdminDashboard() {
  const [section, setSection] = useState("events");
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/events`)
        .then((res) => res.json())
        .then(setEvents);

      fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setUsers);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const fetchEvents = async () => {
    const res = await fetch(`${API_URL}/events`);
    const data = await res.json();
    setEvents(data);
  };

  const handleDeleteEvent = async (id: string) => {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      fetchEvents();
    } else {
      const err = await res.json();
      alert(err.message || "Failed to delete event");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Menu</h2>
        <button
          className={section === "events" ? "active" : ""}
          onClick={() => setSection("events")}
        >
          Manage Events
        </button>
        <button
          className={section === "users" ? "active" : ""}
          onClick={() => setSection("users")}
        >
          Users
        </button>
        <button
          className={section === "admins" ? "active" : ""}
          onClick={() => setSection("admins")}
        >
          Create Admin
        </button>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Admin Dashboard</h1>

        {/* Events Section */}
        {section === "events" && (
          <div>
            <h2>Manage Events</h2>
            {events.length === 0 && <p>No events found.</p>}
            <div className="event-grid">
              {events.map((e) => {
                const avgRating =
                  e.reviews && e.reviews.length
                    ? (
                        e.reviews.reduce(
                          (a: number, r: Review) => a + r.rating,
                          0
                        ) / e.reviews.length
                      ).toFixed(1)
                    : null;

                return (
                  <div key={e.id} className="event-card">
                    <h3>{e.title}</h3>
                    <p>
                      <strong>Location:</strong> {e.location}
                    </p>
                    <p>
                      <strong>Time:</strong> {e.time}
                    </p>
                    <p>
                      <strong>Tags:</strong>{" "}
                      {e.tags?.length ? e.tags.join(", ") : "—"}
                    </p>
                    <p>
                      <strong>Attendees:</strong> {e.attendees?.length || 0}
                    </p>
                    <p>
                      <strong>Rating:</strong>{" "}
                      {avgRating ? avgRating : "No ratings yet"}
                    </p>
                    <button
                      className="delete"
                      onClick={() => handleDeleteEvent(e.id)}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Users Section */}
        {section === "users" && (
          <div>
            <h2>All Users</h2>
            {users.length === 0 && <p>No users found.</p>}
            <div className="user-grid">
              {users.map((u) => (
                <div key={u.id} className="user-card">
                  <h3>{u.name}</h3>
                  <p>
                    <strong>Email:</strong> {u.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {u.role}
                  </p>
                  <p>
                    <strong>Bio:</strong> {u.bio || "—"}
                  </p>
                  <p>
                    <strong>Interests:</strong> {u.interests?.join(", ") || "—"}
                  </p>
                  <p>
                    <strong>Rating:</strong> {u.rating || 0}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Creation Section */}
        {section === "admins" && <AdminSignupForm />}
      </div>
    </div>
  );
}
