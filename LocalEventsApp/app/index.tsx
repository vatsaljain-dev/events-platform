import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { AppContext } from "./_layout";
import { ActivityIndicator, Text } from "react-native-paper";
import { View } from "react-native";

export default function Index() {
  const { currentUser } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentUser) {
        router.replace("/tabs" as any);
      } else {
        router.replace("/login");
      }
    }, 0); // defer to next tick
    return () => clearTimeout(timer);
  }, [currentUser, router]);

  return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Loading App...</Text>
        </View>
  );
}

