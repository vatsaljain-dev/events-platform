import { useCallback, useEffect, useState } from "react";
import AdminSignupForm from "../components/AdminSignupForm";
import API_URL from "../config";
import { useNavigate } from "react-router-dom";

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

type ChatMessage = {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
};

type ChatSummary = {
  eventId: string;
  eventName: string;
  lastMessage: string;
  lastMessageTime: string | null;
};

export default function AdminDashboard() {
  const [section, setSection] = useState("events");
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [chatSummary, setChatSummary] = useState<ChatSummary[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch events
  const fetchEventsCall = useCallback(async () => {
    const res = await fetch(`${API_URL}/events`);
    const data = await res.json();
    setEvents(data);
  }, []); // no dependencies needed here

  // Fetch users
  const fetchUsersCall = useCallback(async () => {
    const res = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  }, [token]);

  // Fetch chat summary
  const fetchChatSummaryCall = useCallback(async () => {
    const res = await fetch(`${API_URL}/events/chat-summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setChatSummary(data);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (section === "events") fetchEventsCall();
    if (section === "users") fetchUsersCall();
    if (section === "chats") fetchChatSummaryCall();
  }, [token, section, fetchEventsCall, fetchUsersCall, fetchChatSummaryCall]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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

  const loadMessages = async (eventId: string) => {
    setSelectedEvent(eventId);
    const res = await fetch(`${API_URL}/events/${eventId}/chat`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessages(data.reverse());
  };


  const deleteMessage = async (messageId: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this message?");
  if (!confirmDelete) return;

  const res = await fetch(`${API_URL}/events/chat/${messageId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok && selectedEvent) {
    await loadMessages(selectedEvent);
    await fetchChatSummaryCall();
  } else {
    const err = await res.json();
    alert(err.message || "Failed to delete message");
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
          className={section === "chats" ? "active" : ""}
          onClick={() => {
            setSelectedEvent(null); // reset view
            setSection("chats");
          }}
        >
          Chats
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

        {/* Chats Section */}

        {section === "chats" && (
          <div className="chats-section">
            {!selectedEvent ? (
              <div>
                <h2 className="chats-heading">Chats</h2>
                <div className="chat-summary-list">
                  {chatSummary.length === 0 && <p>No events with chats.</p>}
                  {chatSummary.map((event) => (
                    <div
                      key={event.eventId}
                      className="chat-summary-card"
                      onClick={() => loadMessages(event.eventId)}
                    >
                      <div className="chat-summary-header">
                        <h3>{event.eventName}</h3>
                        {event.lastMessageTime && (
                          <small>
                            {new Date(event.lastMessageTime).toLocaleString()}
                          </small>
                        )}
                      </div>
                      <p
                        className={`chat-summary-message ${
                          event.lastMessage ? "has-message" : "no-message"
                        }`}
                      >
                        {event.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="chat-container">
                <div className="chat-header">
                  <button
                    className="back-btn"
                    onClick={() => setSelectedEvent(null)}
                  >
                    ← Back
                  </button>
                  <h2>Chat Messages</h2>
                </div>

                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <p>No messages yet.</p>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="chat-message-card">
                        <div className="chat-message-content">
                          <strong>{msg.userName}</strong>
                          <p>{msg.text}</p>
                          <small>
                            {new Date(msg.timestamp).toLocaleString()}
                          </small>
                        </div>
                        <button
                          className="delete-msg"
                          onClick={() => deleteMessage(msg.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
