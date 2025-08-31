import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button, Card, Chip } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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

interface EventItemCardProps {
  item: Event;
  currentUserId: string;
  onJoinLeave: (eventId: string, isJoined: boolean, title: string) => void;
  onReview: (event: Event) => void;
}

export const EventItemCard = ({
  item,
  currentUserId,
  onJoinLeave,
  onReview,
}: EventItemCardProps) => {
  const isJoined = item.attendees.includes(currentUserId);

  // calculating average rating
  const avgRating = item.reviews?.length
    ? (
        item.reviews.reduce((a, r) => a + r.rating, 0) /
        item.reviews.length
      ).toFixed(1)
    : null;

  return (
    <Card
      style={{
        marginBottom: 16,
        borderRadius: 16,
        elevation: 3,
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      <Card.Title
        title={item.title}
        titleStyle={{ fontWeight: "700", fontSize: 18 }}
        subtitle={`${item.location} • ${item.time}`}
        subtitleStyle={{ fontSize: 14, color: "#666" }}
        left={() => <Icon name="calendar" size={26} color="#6200ee" />}
        leftStyle={{ marginRight: 0 }}
      />

      <Card.Content style={{ marginTop: 8 }}>
        {/* Tags */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: 8,
          }}
        >
          {item.tags.filter((t) => t.trim() !== "").length ? (
            item.tags
              .filter((t) => t.trim() !== "")
              .map((tag, idx) => (
                <Chip
                  key={idx}
                  style={{
                    marginRight: 6,
                    marginBottom: 6,
                    backgroundColor: "#f0e6ff",
                    borderRadius: 14,
                  }}
                  textStyle={{ fontSize: 12, color: "#6200ee" }}
                >
                  {tag}
                </Chip>
              ))
          ) : (
            <Text style={{ color: "#999" }}>No tags</Text>
          )}
        </View>

        {/* Attendees + Rating Row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="account-group" size={18} color="#555" />
            <Text style={{ marginLeft: 4 }}>
              {item.attendees.length} Attendees
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="star" size={18} color="#FFD700" />
            <Text style={{ marginLeft: 4 }}>
              {avgRating ? avgRating : "No ratings yet"}
            </Text>
          </View>
        </View>
      </Card.Content>

      {/* Actions */}
      <Card.Actions style={{ justifyContent: "flex-end", marginTop: 8 }}>
        {/* Join/Leave */}
        <Button
          mode={isJoined ? "outlined" : "contained"}
          onPress={() => onJoinLeave(item.id, isJoined, item.title)}
          style={{ borderRadius: 8, marginRight: 8 }}
        >
          {isJoined ? "Leave" : "Join"}
        </Button>

        {/* Review */}
        {isJoined && (
          <Button
            mode="outlined"
            style={{ borderRadius: 8, marginRight: 8 }}
            onPress={() => onReview(item)}
          >
            Review
          </Button>
        )}

        {/* Chat */}
        {isJoined && (
          <Button
            mode="outlined"
            style={{ borderRadius: 8 }}
            onPress={() =>
              router.push({
                pathname: "/chat/[id]",
                params: { id: item.id },
              })
            }
          >
            Chat
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
};
