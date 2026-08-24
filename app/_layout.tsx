import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import * as Notifications from "expo-notifications";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Platform, View } from "react-native";

// Importa o analytics da Vercel de forma segura apenas para Web
import { Analytics } from '@vercel/analytics/react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
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

  if (!fontsLoaded && Platform.OS !== "web") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8FAFC",
        }}
      >
        <ActivityIndicator size="large" color="#6D28D9" />
      </View>
    );
  }

  return (
    <>
      <Slot />
      {/* O Analytics da Vercel será injetado apenas quando acessado via Web */}
      {Platform.OS === 'web' && <Analytics />}
    </>
  );
}