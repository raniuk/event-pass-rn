import { Link, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, StatusBar, View } from "react-native";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { api } from "@/server/api";
import { useBadgeStore } from "@/store/badge-store";
import { colors } from "@/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type EventProps = {
  id: string;
  title: string;
};

export default function Home() {
  const [events, setEvents] = useState<EventProps[]>([]);

  const [eventId, setEventId] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const badgeStore = useBadgeStore();

  async function handleAccessCredentials() {
    try {
      if (!eventId.trim() || !code.trim()) {
        return Alert.alert(
          "Income code",
          "Select a event and enter entry code"
        );
      }

      setIsLoading(true);

      const { data } = await api.get(`/attendees/${eventId}/${code}/badge`);

      badgeStore.save(data.badge);
    } catch (error) {
      setIsLoading(false);

      Alert.alert(
        "Income code",
        "An error occurred while accessing your tickets"
      );
    }
  }

  async function getEvents() {
    const response = await api.get("/events");

    setEvents(response.data.events);
  }

  useEffect(() => {
    getEvents();
  }, []);

  if (badgeStore.data?.checkInURL) {
    return <Redirect href="/ticket" />;
  }

  return (
    <View className="flex-1 bg-green-500 items-center justify-center px-8">
      <StatusBar barStyle="light-content" />
      <Image
        source={require("@/assets/logo.png")}
        className="h-24"
        resizeMode="contain"
      />
      <View className="w-full mt-12 gap-3">
        <Select
          data={events}
          onSelect={(selectedItem) => setEventId(selectedItem.id)}
        />
        <Input>
          <MaterialCommunityIcons
            name="ticket-confirmation-outline"
            size={20}
            color={colors.gray[200]}
          />
          <Input.Field placeholder="Enter income code" onChangeText={setCode} />
        </Input>

        <Button
          title="Check credential"
          isLoading={isLoading}
          onPress={handleAccessCredentials}
        />

        <Link
          href="/register"
          className="text-gray-200 py-3 text-base font-bold text-center mt-8"
        >
          No tickets yet? register
        </Link>
      </View>
    </View>
  );
}
