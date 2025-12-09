import React, { useEffect } from "react";
import { StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";
import { UserProvider } from "./src/context/UserContext";

import * as Notifications from "expo-notifications";

// ⚠️ OBRIGATÓRIO: mostrar notificações quando o app está aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ⚠️ OBRIGATÓRIO: criar o canal de notificação no Android
async function configurarCanal() {
  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
}

export default function App() {

  useEffect(() => {
    configurarCanal();
  }, []);

  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#006FFD" barStyle={"light-content"} />
        <Routes />
      </NavigationContainer>
    </UserProvider>
  );
}
