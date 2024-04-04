import { MotiView } from "moti";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { BadgeStore } from "@/store/badge-store";
import { colors } from "@/styles/colors";
import { Feather } from "@expo/vector-icons";

import QRCode from "./qrcode";

type ImageProps = {
  data: BadgeStore;
  avatar?: string;
  onChangeAvatar?: () => void;
  onExpandQRCode?: () => void;
};

export default function Credential({
  data,
  onChangeAvatar,
  onExpandQRCode,
}: ImageProps) {
  const { height } = useWindowDimensions();

  return (
    <MotiView
      className="w-full self-stretch items-center"
      from={{
        opacity: 0,
        translateY: -height,
      }}
      animate={{
        opacity: 1,
        translateY: 0,
      }}
      transition={{
        type: "timing",
      }}
    >
      <View className="bg-black/20 self-stretch items-center pb-4 border border-white/10 rounded-2xg ">
        <ImageBackground
          source={require("@/assets/header.png")}
          className="px-6 py-8 h-56 items-center self-stretch border-b border-white/10 overflow-hidden"
        />

        {data.image ? (
          <TouchableOpacity activeOpacity={0.9} onPress={onChangeAvatar}>
            <Image
              source={{ uri: data.image }}
              className="w-36 h-36 rounded-full -mt-20 border-2 border-white"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            className="w-36 h-36 rounded-full -mt-20 bg-gray-400 border-2 border-white items-center justify-center"
            onPress={onChangeAvatar}
          >
            <Feather name="camera" color={colors.green[400]} size={36} />
          </TouchableOpacity>
        )}

        <Text className="text-zinc-50 text-2xg font-bold mt-4">
          {data.name}
        </Text>

        <Text className="text-zinc-300 text-base font-regular mb-8">
          {data.email}
        </Text>

        <QRCode value={data.checkInURL} size={120} />

        <TouchableOpacity
          activeOpacity={0.7}
          className="mt-2"
          onPress={onExpandQRCode}
        >
          <Text className="font-bold px-4 py-2 text-teal-500 text-sm">
            Expand QRCode
          </Text>
        </TouchableOpacity>
      </View>
    </MotiView>
  );
}
