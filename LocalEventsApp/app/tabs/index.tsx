import React, { useContext, useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Text, FAB, ActivityIndicator } from "react-native-paper";
import { AppContext } from "../_layout";
import API_URL from "../../utils/config";
import { showLocalNotification } from "@/utils/notifications";
import { EventItemCard } from "@/components/EventCard";
import { ReviewModal } from "@/components/ReviewModal";
import { AddEventModal } from "@/components/AddEventModal";

interface Event {
  id: string;
  title: string;
  location: string;
  time: string;
  tags: string[];
  attendees: string[];
  hostId: string;
  reviews?: { userId: string; rating: number; comment?: string }[];
}

export default function EventsTab() {
  const { currentUser } = useContext(AppContext);
  const [events, setEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // fo

  // Event modal state
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [tags, setTags] = useState("");

  // Review modal state
  const [reviewVisible, setReviewVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      if (!refreshing) setLoading(true);
      const res = await fetch(`${API_URL}/events`);
      const data = await res.json();
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setEvents(sorted);
    } catch (err) {
      console.warn("Error fetching events:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const handleAddEvent = async () => {
    try {
      const res = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          location,
          time,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t !== ""),
          hostId: currentUser?.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchEvents();
        setVisible(false);
        setTitle("");
        setLocation("");
        setTime("");
        setTags("");
      } else {
        alert(data.message);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleJoinLeave = async (
    eventId: string,
    isJoined: boolean,
    eventName: string
  ) => {
    try {
      const endpoint = isJoined ? "leave" : "join";
      const res = await fetch(`${API_URL}/events/${eventId}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser?.id }),
      });
      const updated = await res.json();
      if (res.ok) {
        setEvents(events.map((e) => (e.id === updated.id ? updated : e)));

        showLocalNotification(
          `${isJoined ? "Left" : "Joined"} ${eventName}`,
          `You have successfully ${
            isJoined ? "left" : "joined"
          } ${eventName} event.`,
          {
            type: isJoined ? "leave" : "join",
            eventId,
            eventName,
            userId: currentUser?.id,
          }
        );
      } else {
        alert(updated.message);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedEvent || !rating) return;
    try {
      const res = await fetch(`${API_URL}/events/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.id,
          rating,
          comment: "",
          id: selectedEvent.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Review submitted!");
        fetchEvents();
      } else {
        alert(data.message);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setReviewVisible(false);
      setRating(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Loading events...</Text>
        </View>
      ) : (
        <>
          <FlatList
            contentContainerStyle={{ padding: 16 }}
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventItemCard
                item={item}
                currentUserId={currentUser?.id || ""}
                onJoinLeave={handleJoinLeave}
                onReview={(ev) => {
                  setSelectedEvent(ev);
                  setReviewVisible(true);
                }}
              />
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 40 }}>
                No events yet. Add one!
              </Text>
            }
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />

          {/* Floating Add Event Button */}
          <FAB
            icon="plus"
            style={{
              position: "absolute",
              right: 20,
              bottom: 20,
              backgroundColor: "#6200ee",
            }}
            color="white"
            onPress={() => setVisible(true)}
          />

          {/* Add Event Modal */}

          <AddEventModal
            visible={visible}
            title={title}
            location={location}
            time={time}
            tags={tags}
            setTitle={setTitle}
            setLocation={setLocation}
            setTime={setTime}
            setTags={setTags}
            onDismiss={() => setVisible(false)}
            onSave={handleAddEvent}
          />
          {/* Review Modal */}
          <ReviewModal
            visible={reviewVisible}
            rating={rating}
            setRating={setRating}
            onDismiss={() => setReviewVisible(false)}
            onSubmit={handleSubmitReview}
          />
        </>
      )}
    </View>
  );
}
