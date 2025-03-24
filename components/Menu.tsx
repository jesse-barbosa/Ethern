import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Menu() {
  const navigation = useNavigation();
  const route = useRoute();

  const screens = [
    { name: 'Home', icon: 'list-alt' as const, title: 'Tarefas'},
    { name: 'Notations', icon: 'sticky-note-2' as const, title: 'Anotações'},
    { name: 'Settings', icon: 'settings' as const, title: 'Configs'}
  ]

  return (
      <View className="w-full flex flex-row items-center justify-around bg-blue-500 py-2 mt-2">
        {screens.map((screen, index) => (
          <TouchableOpacity key={screen.name} onPress={() => (navigation as any).navigate(screen.name)} className="flex items-center rounded-lg p-1">
              <MaterialIcons name={screen.icon} size={28} color={route.name === screen.name? '#fff' : '#d4d4d4'} />
              <Text className={`text-md ${route.name === screen.name? 'text-white' : 'text-neutral-300'}`}>{screen.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
  );
}