import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import {
  Text,
  Button,
  Avatar,
  Card,
  Chip,
  TextInput,
  Modal,
  Portal,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../_layout";
import { useRouter } from "expo-router";
import API_URL from "../../utils/config";

export default function ProfileTab() {
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const router = useRouter();

  // Edit modal state
  const [visible, setVisible] = useState(false);
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [interests, setInterests] = useState(
    currentUser?.interests?.join(", ") || ""
  );

  // Host rating
  const [hostRating, setHostRating] = useState<number | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchHostRating(currentUser.id);
    }
  }, [currentUser]);

  const fetchHostRating = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/users/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      setHostRating(Number(data.rating));
    } catch (err) {
      console.warn("Failed to fetch rating:", err);
    }
  };

  if (!currentUser)
    return (
      <Text style={{ textAlign: "center", marginTop: 40 }}>Not logged in</Text>
    );

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setCurrentUser(null);
    router.replace("/login");
  };

  const handleSaveProfile = async () => {
    const updatedUser = {
      ...currentUser,
      bio,
      interests: interests
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i !== ""),
    };

    // Update locally
    setCurrentUser(updatedUser);

    // Update backend
    try {
      await fetch(`${API_URL}/users/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
    } catch (err) {
      console.warn("Profile update failed:", err);
    }

    setVisible(false);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Profile Header */}
      <Card style={{ margin: 16, borderRadius: 12, elevation: 3 }}>
        <Card.Content style={{ alignItems: "center", paddingVertical: 20 }}>
          <Avatar.Text
            size={90}
            label={currentUser.name.charAt(0).toUpperCase()}
          />
          <Text style={{ fontSize: 22, fontWeight: "700", marginTop: 10 }}>
            {currentUser.name}
          </Text>
          <Text style={{ fontSize: 14, color: "gray", marginBottom: 5 }}>
            {currentUser.email}
          </Text>
          <Text style={{ fontSize: 14, color: "gray" }}>
            Role: {currentUser.role}
          </Text>

          {/* Host Rating */}
          <Text style={{ fontSize: 16, marginTop: 10 }}>
            ⭐ Host Rating:{" "}
            {hostRating && hostRating > 0 ? hostRating : "No ratings yet"}
          </Text>
        </Card.Content>
      </Card>

      {/* Bio Section */}
      <Card style={{ marginHorizontal: 16, marginBottom: 16, borderRadius: 12 }}>
        <Card.Title title="Bio" titleStyle={{ fontWeight: "600" }} />
        <Card.Content>
          <Text>
            {currentUser.bio && currentUser.bio.trim() !== ""
              ? currentUser.bio
              : "No bio provided yet."}
          </Text>
        </Card.Content>
      </Card>

      {/* Interests Section */}
      <Card style={{ marginHorizontal: 16, marginBottom: 16, borderRadius: 12 }}>
        <Card.Title title="Interests" titleStyle={{ fontWeight: "600" }} />
        <Card.Content style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {currentUser.interests && currentUser.interests.length > 0 ? (
            currentUser.interests.map((interest: string, idx: number) => (
              <Chip key={idx} style={{ margin: 4 }}>
                {interest}
              </Chip>
            ))
          ) : (
            <Text>No interests added yet.</Text>
          )}
        </Card.Content>
      </Card>

      {/* Buttons */}
      <View style={{ margin: 16 }}>
        <Button
          mode="outlined"
          onPress={() => setVisible(true)}
          style={{ marginBottom: 10 }}
        >
          Edit Profile
        </Button>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={{ borderRadius: 8 }}
          contentStyle={{ paddingVertical: 8 }}
        >
          Logout
        </Button>
      </View>

      {/* Edit Profile Modal */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 20,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
            Edit Profile
          </Text>

          <TextInput
            label="Bio"
            value={bio}
            onChangeText={setBio}
            mode="outlined"
            multiline
            style={{ marginBottom: 15, backgroundColor: "white" }}
          />

          <TextInput
            label="Interests (comma separated)"
            value={interests}
            onChangeText={setInterests}
            mode="outlined"
            style={{ marginBottom: 20, backgroundColor: "white" }}
          />

          <Button mode="contained" onPress={handleSaveProfile}>
            Save Changes
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
}
