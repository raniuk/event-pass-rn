import * as ImagePicker from "expo-image-picker";
import { Redirect } from "expo-router";
import { MotiView } from "moti";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "@/components/button";
import Credential from "@/components/credential";
import { Header } from "@/components/header";
import QRCode from "@/components/qrcode";
import { useBadgeStore } from "@/store/badge-store";
import { colors } from "@/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Ticket() {
  const [expandQRCode, setExpandQRCode] = useState<boolean>(false);

  const badgeStore = useBadgeStore();

  async function handleShare() {
    try {
      if (badgeStore.data?.checkInURL) {
        await Share.share({
          message: badgeStore.data.checkInURL,
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Share", "An error occurred while sharing");
    }
  }

  async function handleSelectAvatar() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
      });

      if (result.assets) {
        badgeStore.updateAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!badgeStore.data?.checkInURL) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1 bg-green-500 ">
      <StatusBar barStyle="light-content" />
      <Header
        title={badgeStore.data.eventTitle}
        subtitle={`#${badgeStore.data.id}`}
      />

      <ScrollView
        className="-mt-28 -z-10"
        contentContainerClassName="px-8 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Credential
          data={badgeStore.data}
          onChangeAvatar={handleSelectAvatar}
          onExpandQRCode={() => setExpandQRCode(true)}
        />

        <MotiView
          from={{ translateY: 0 }}
          animate={{ translateY: 10 }}
          transition={{ loop: true, type: "timing", duration: 700 }}
        >
          <MaterialCommunityIcons
            name="chevron-down"
            size={32}
            color={colors.gray[300]}
            className="self-center my-2"
          />
        </MotiView>

        <Text className="text-gray-200 font-bold text-2xl mt-4">
          Share event
        </Text>

        <Text className="text-gray-200 font-regular text-base mt-1 mb-6">
          Show that you are going to participate in the event{" "}
          {badgeStore.data?.eventTitle}
        </Text>

        <Button title="Share" onPress={handleShare} />

        <TouchableOpacity
          activeOpacity={0.7}
          className="mt-10"
          onPress={badgeStore.remove}
        >
          <Text className="text-white py-3 font-bold text-base text-center">
            Remove Income
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={expandQRCode} statusBarTranslucent animationType="fade">
        <View className="flex-1 bg-green-500 items-center justify-center">
          <QRCode value={"Test"} size={300} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setExpandQRCode(false)}
          >
            <Text className="border border-white/10 rounded-md px-6 py-3 text-bold text-teal-500 text-center mt-10">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
