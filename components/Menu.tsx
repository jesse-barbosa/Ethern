import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Menu() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
      <View className="w-full flex flex-row items-center justify-around bg-blue-500 py-2 mt-2">
        <TouchableOpacity onPress={() => (navigation as any).navigate("Home")} className={`${route.name === "Home" ? 'bg-blue-600' : ''} flex items-center rounded-lg p-1`}>
            <MaterialIcons name="list-alt" size={28} color='#fff' />
            <Text className="text-md text-white">Tarefas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => (navigation as any).navigate("Settings")} className={`${route.name === "Settings" ? 'bg-blue-600' : ''} flex items-center rounded-lg p-1`}>
            <MaterialIcons name="settings" size={28} color='#fff' />
            <Text className="text-md text-white">Configs</Text>
        </TouchableOpacity>
      </View>
  );
}