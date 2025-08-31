import React, { useEffect, useState, createContext } from "react";
import { Stack } from "expo-router";
import { Provider as PaperProvider , DefaultTheme} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../utils/config";
import { Alert, Platform, StatusBar } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  } else {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Notification permissions not granted!");
      if (!Device.isDevice) {
        Alert.alert(
          "Simulator Fallback",
          "Notifications are not supported in this simulator, but would work on a real device."
        );
        console.log("⚠️ Notifications not supported in simulator/emulator.");
      }
      return;
    }
  }}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string;
  interests: string[];
  rating: number;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
}
const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
    text: "black",
  },
};




export const AppContext = createContext<AppContextType>({} as AppContextType);

export default function RootLayout() {
   useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentUser(data.user);
          }
        } catch (err) {
          console.warn("Session restore failed", err);
        }
      }
      setLoading(false);
    };
    restoreUser();
  }, []);

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser }}>
            <StatusBar barStyle={'dark-content'} />   
      <PaperProvider theme={lightTheme}>
   <Stack screenOptions={{ headerShown: false }}>
  {currentUser
    ? [
        <Stack.Screen key="tabs" name="tabs" />,
      ]
    : [
        <Stack.Screen key="login" name="login" />,
        <Stack.Screen key="signup" name="signup" />
      ]
  }
</Stack>



      </PaperProvider>
    </AppContext.Provider>
  );
}
