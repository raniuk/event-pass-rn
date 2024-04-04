import axios from "axios";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, StatusBar, View } from "react-native";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { api } from "@/server/api";
import { useBadgeStore } from "@/store/badge-store";
import { colors } from "@/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type EventProps = {
  id: string;
  title: string;
};

export default function Register() {
  const [events, setEvents] = useState<EventProps[]>([]);

  const [eventId, setEventId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const badgeStore = useBadgeStore();

  async function getEvents() {
    const response = await api.get("/events");
    setEvents(response.data.events);
  }

  useEffect(() => {
    getEvents();
  }, []);

  async function handleRegister() {
    try {
      if (!name.trim() || !email.trim()) {
        return Alert.alert("Register", "Enter name and email");
      }

      setIsLoading(true);

      const response = await api.post(`/events/${eventId}/attendees`, {
        name,
        email,
      });

      if (response.data.attendeeId) {
        const badgeResponse = await api.get(
          `/attendees/${response.data.attendeeId}/badge`
        );

        badgeStore.save(badgeResponse.data.badge);

        Alert.alert("Register", "Register successfully", [
          { text: "OK", onPress: () => router.push("/ticket") },
        ]);
      }
    } catch (error) {
      setIsLoading(false);

      if (axios.isAxiosError(error)) {
        if (
          String(error.response?.data.message).includes("already registered")
        ) {
          return Alert.alert("Register", "Email already registered");
        }
      }

      Alert.alert("Register", "An error occurred while registering");
    }
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
            name="account"
            size={20}
            color={colors.gray[200]}
          />
          <Input.Field placeholder="Full name" onChangeText={setName} />
        </Input>

        <Input>
          <MaterialCommunityIcons
            name="email"
            size={20}
            color={colors.gray[200]}
          />
          <Input.Field
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </Input>

        <Button
          title="Register"
          isLoading={isLoading}
          onPress={handleRegister}
        />

        <Link
          href="/"
          className="text-gray-200 py-3 text-base font-bold text-center mt-8"
        >
          Already have a ticket?
        </Link>
      </View>
    </View>
  );
}
