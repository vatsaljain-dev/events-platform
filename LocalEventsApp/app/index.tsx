import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { AppContext } from "./_layout";
import { Text } from "react-native-paper";
import { ActivityIndicator, View } from "react-native";

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
    }, 0);
    return () => clearTimeout(timer);
  }, [currentUser, router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#6200ee" />
      <Text style={{ marginTop: 10 }}>Loading App...</Text>
    </View>
  );
}
