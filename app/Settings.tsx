import { useState } from "react";
import { ScrollView, View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { UserRound, AtSign } from "lucide-react-native";
import Menu from "../components/Menu";

export default function Settings() {
  const user = useSelector((state: RootState) => state.user);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isChanged, setIsChanged] = useState(false)

  const saveChanges = () => {
    // Salvar alterações no banco e no Redux
  };

  return (
    <View className="flex-1 bg-white">

        <Text className="text-3xl font-medium mt-8 mx-3 mb-4">Configurações</Text>
        <View className="flex items-center py-4">
          <Image source={require("../assets/images/userIcon.png")} className="h-48 w-48 rounded-full" />
        </View>

        {/* Inputs */}
        <View className="p-6">
          {/* Input - Nome */}
          <View className="w-full max-w-md flex flex-row gap-3 mt-6 items-center border-neutral-500 border-b-2">
            <UserRound size={22} color="#8B8787" />
            <TextInput
              placeholder="Nome"
              className="flex-1 text-lg text-neutral-800 py-5"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setIsChanged(true);
              }}
            />
          </View>

          {/* Input - Email */}
          <View className="w-full max-w-md flex flex-row gap-3 mt-6 items-center border-neutral-500 border-b-2">
            <AtSign size={22} color="#8B8787" />
            <TextInput
              placeholder="Email"
              className="flex-1 text-lg text-neutral-800 py-5"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setIsChanged(true);
              }}
            />
          </View>
        </View>

        <View className="p-4 mt-auto">
          <TouchableOpacity 
            onPress={saveChanges} 
            disabled={!isChanged}
            className={`${isChanged ? 'opacity-100' : 'opacity-70'} flex flex-row items-center justify-center w-full bg-blue-500 py-4 rounded-lg shadow-xl`}
          >
            <Text className="text-xl text-white font-semibold">Salvar Alterações</Text>
          </TouchableOpacity>
        </View>

      <Menu />
    </View>
  );
}