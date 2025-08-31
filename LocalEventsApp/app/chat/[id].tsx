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
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { AppContext } from "../_layout";
import API_URL from "../../utils/config";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import MessageBubble from "@/components/MessageBubble";

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

  const renderItem = ({ item }: { item: any }) => (
    <MessageBubble item={item} currentUserId={currentUser?.id} />
  );

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
