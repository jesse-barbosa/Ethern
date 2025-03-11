import { View, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const navigation = useNavigation();

  return (
      <View className="w-full flex flex-row items-center justify-between bg-blue-500 h-24 px-4">
        <Text className="text-3xl text-white font-semibold mt-3">Lumina</Text>
        <TouchableOpacity onPress={() => (navigation as any).navigate("Settings")} className="mt-3">
            <Image source={require("../assets/images/userIcon.png")} className="h-14 w-14 rounded-full" />
        </TouchableOpacity>
      </View>
  );
}