import { View, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const navigation = useNavigation();

  return (
      <View className="w-full flex flex-row items-center justify-between bg-blue-500 py-4 px-3">
        <View className="flex flex-row items-center gap-3">
          <Image source={require("../assets/icon.png")} className="h-10 w-10" />
          <Text className="text-3xl text-white font-semibold ">Lumina</Text>
        </View>
        <TouchableOpacity onPress={() => (navigation as any).navigate("Settings")} className="">
            <Image source={require("../assets/images/userIcon.png")} className="h-12 w-12 rounded-full" />
        </TouchableOpacity>
      </View>
  );
}