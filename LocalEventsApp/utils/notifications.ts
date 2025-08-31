import * as Notifications from "expo-notifications";

export async function showLocalNotification(
  title: string,
  body: string,
  data: Record<string, unknown> = {}
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null, // fire immediately
  });
}
