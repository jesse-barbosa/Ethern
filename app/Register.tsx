import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { UserRound, AtSign, KeyRound, Eye, EyeOff, ArrowBigRightDash } from 'lucide-react-native';
import { useState } from 'react';

export default function Home() {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    // Logic to create user
    (navigation as any).navigate('Home');
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }
  return (
    <View className="flex-1">
      <View className="w-full flex items-center justify-center py-6">
        <Text className="font-extrabold text-3xl">Lumina</Text>
      </View>
      {/* Inputs */}
      <View className="flex-1 flex flex-col items-center justify-center px-8 mt-8">

        {/* Input - Nome */}
        <View className="w-full max-w-md flex flex-row gap-3 mt-6 items-center border-neutral-500 border-b-2 py-2">
          <UserRound size={26} color="#8B8787" />
          <TextInput 
            placeholder="Nome" 
            className="flex-1 text-md text-neutral-700"
          />
        </View>

        {/* Input - Email */}
        <View className="w-full max-w-md flex flex-row gap-3 mt-6 items-center border-neutral-500 border-b-2 py-2">
          <AtSign size={26} color="#8B8787" />
          <TextInput 
            placeholder="Email" 
            className="flex-1 text-md text-neutral-700"
          />
        </View>

        {/* Input - Password */}
        <View className="w-full max-w-md flex flex-row gap-3 mt-6 items-center border-neutral-500 border-b-2 py-2">
          <KeyRound size={26} color="#8B8787" />
          <TextInput 
            placeholder="Senha" 
            secureTextEntry={!showPassword}
            className="flex-1 text-md text-neutral-700"
          />
          <TouchableOpacity onPress={togglePasswordVisibility} className="flex-shrink-0">
            {showPassword ? (
              <EyeOff size={26} color="#8B8787" />
            ) : (
              <Eye size={26} color="#8B8787" />
            )}
          </TouchableOpacity>
        </View>

      </View>
      <View className="m-6">
        <TouchableOpacity 
          onPress={handleRegister} 
          className="flex flex-row px-4 items-center justify-between w-full bg-yellow-200 py-4 rounded-lg shadow-xl"
        >
          <View />
          <Text className="text-xl font-semibold">Registrar</Text>
          <ArrowBigRightDash size={30} color="#000" />
        </TouchableOpacity>
        <View className="flex flex-row items-center justify-center">
          <Text className="text-neutral-600 text-center mt-4">Já tem uma conta?</Text>
          <TouchableOpacity 
            onPress={() => (navigation as any).navigate('Login')} 
            className="flex flex-row items-center text-neutral-700 text-center mt-4"
          ><Text className="text-blue-500 ms-1 font-medium">Faça Login</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}