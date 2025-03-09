import { View, TouchableOpacity, Text, Image } from 'react-native';
import { ClipboardList, Settings } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const navigation = useNavigation();

  return (
      <View className="w-full flex flex-row items-center justify-between bg-blue-500 pt-6 p-2">
        <Text className="text-3xl text-white font-semibold">Lumina</Text>
        <TouchableOpacity onPress={(navigation as any).navigate("Home")}>
            <Image source={require("../assets/images/userIcon.png")} className="h-16 w-16 rounded-full" />
        </TouchableOpacity>
      </View>
  );
}