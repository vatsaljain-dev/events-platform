export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
  bio: string;
  interests: string[];
  rating: number;
}

export interface Event {
  id: string;
  title: string;
  location: string;
  time: string;
  tags: string[];
  attendees: string[];
  hostId: string;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
}

// Fake database
export const users: User[] = [
  { id: "1", email: "test@test.com", password: "1234", name: "Vatsal", role: "user", bio: "Love attending events", interests: ["Tech"], rating: 4 },
  { id: "2", email: "admin@test.com", password: "1234", name: "Admin", role: "admin", bio: "Community manager", interests: ["Sports"], rating: 5 },
];

export const events: Event[] = [
  { id: "1", title: "Music Jam Night", location: "Bangalore", time: "7 PM", tags: ["Music"], attendees: ["1"], hostId: "1" },
  { id: "2", title: "Tech Meetup", location: "Online", time: "6 PM", tags: ["Tech"], attendees: [], hostId: "2" },
];

export const chats: Record<string, Message[]> = {
  "1": [{ id: "m1", text: "Excited for this event!", userId: "1", createdAt: new Date() }],
  "2": [],
};
