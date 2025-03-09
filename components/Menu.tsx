import { View, TouchableOpacity, Text } from 'react-native';
import { ClipboardList, Settings } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function Menu() {
  const navigation = useNavigation();

  return (
      <View className="w-full flex flex-row items-center justify-around bg-blue-500 py-2">
        <TouchableOpacity onPress={() => (navigation as any).navigate("Home")} className="flex items-center rounded-lg p-3 bg-blue-600">
            <ClipboardList size={28} color='#fff' />
            <Text className="text-md mt-1 text-white">Tarefas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => (navigation as any).navigate("Home")} className="flex items-center rounded-lg p-3">
            <Settings size={28} color='#fff' />
            <Text className="text-md mt-1 text-white">Configs</Text>
        </TouchableOpacity>
      </View>
  );
}