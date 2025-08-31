import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  View,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from "react-native";
import { Text} from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { AppContext } from "../_layout";
import API_URL from "../../utils/config";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentUser } = useContext(AppContext);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/events/${id}/chat`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.warn("Error fetching messages:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await fetch(`${API_URL}/events/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id, userId: currentUser?.id, text }),
      });
      const newMsg = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, newMsg]);
        setText("");
        flatListRef.current?.scrollToEnd({ animated: true });
      } else {
        alert(newMsg.message);
      }
    } catch (err) {
      console.warn("Send error:", err);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isMine = item.userId === currentUser?.id;

    return (
      <View
        style={{
          alignSelf: isMine ? "flex-end" : "flex-start",
          backgroundColor: isMine ? "#6200ee" : "#e0e0e0",
          borderRadius: 12,
          paddingVertical: 10,
        paddingHorizontal:20,

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
              color: "#333", // darker gray
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

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      edges={["top", "left", "right"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "height" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Input Row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            borderTopWidth: 1,
            borderColor: "#ddd",
            backgroundColor: "white",

            paddingVertical: 20,
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholderTextColor={"black"}
            placeholder="Type a message"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 14,
              marginRight: 8,
              fontSize: 16,
            }}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={{ paddingHorizontal: 10 }}
          >
            <Icon name="send" size={30} color={"#6200ee"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
