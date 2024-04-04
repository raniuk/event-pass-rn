import { Text, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: Props) {
  return (
    <View className="w-full h-28 items-center bg-black/50 px-8 pt-12 border-b border-white/10">
      <Text className="flex-1 text-orange-500 font-bold text-xl text-center">
        {title}
      </Text>
      {subtitle && (
        <Text className="flex-1 text-orange-500 font-medium text-xl text-center">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
