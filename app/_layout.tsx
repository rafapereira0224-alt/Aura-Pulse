import { useEffect } from "react";
import { Slot } from "expo-router";
import * as Notifications from "expo-notifications";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { View, ActivityIndicator, Platform } from "react-native";

handleNotification: async () => ( {
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    async function setupNotificacoes() {
      // Verificação para não rodar código nativo na Web
      if (Platform.OS !== "web") {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === "granted") {
          await Notifications.cancelAllScheduledNotificationsAsync();
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Como foi seu dia? 🌟",
              body: "Reserve 30 segundos para o seu check-in de bem-estar.",
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour: 17,
              minute: 0,
            },
          });
        }
      }
    }
    setupNotificacoes();
  }, []);

  if (!fontsLoaded)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6D28D9" />
      </View>
    );

  return <Slot />;
}
