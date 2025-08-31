import React from "react";
import { View, Text } from "react-native";

interface MessageBubbleProps {
  item: {
    userId: string;
    userName: string;
    text: string;
    timestamp: string | number;
  };
  currentUserId?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ item, currentUserId }) => {
  const isMine = item.userId === currentUserId;

  return (
    <View
      style={{
        alignSelf: isMine ? "flex-end" : "flex-start",
        backgroundColor: isMine ? "#6200ee" : "#e0e0e0",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 4,
        maxWidth: "80%",
      }}
    >
      {/* Username */}
      {!isMine && (
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: "#333",
            marginBottom: 4,
          }}
        >
          {item.userName}
        </Text>
      )}

      {/* Message Text */}
      <Text
        style={{
          color: isMine ? "white" : "black",
          fontSize: 15,
          lineHeight: 20,
        }}
      >
        {item.text}
      </Text>

      {/* Timestamp */}
      <Text
        style={{
          fontSize: 10,
          color: isMine ? "#ddd" : "#555",
          marginTop: 6,
          alignSelf: "flex-end",
        }}
      >
        {new Date(item.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );
};

export default MessageBubble;
