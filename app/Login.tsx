import { supabase } from "../services/supabase";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, AtSign, KeyRound, Eye, EyeOff, ArrowBigRightDash } from "lucide-react-native";

export default function Login() {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleLogin = async () => {
    // Login via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error || !data?.user) {
      Alert.alert("Erro", "Erro ao fazer login: " + (error?.message || "Usuário não encontrado"));
      return;
    }
  
    console.log("Login bem-sucedido:", data.user);
  
    // Buscar os dados do usuário na tabela 'users'
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, name, email, status")
      .eq("user_id", data.user.id)
      .single();
  
    if (userError || !userData || userData.status === 0) {
      Alert.alert("Erro", "Usuário não encontrado");
      return;
    }
  
    console.log("Usuário carregado:", userData);
  
    // Salva usuário no Redux
    dispatch(setUser(userData));
  
    // Redirecionar para Home
    (navigation as any).navigate("Home");
  };  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View className="flex-1">
      <View className="w-full flex flex-row items-center justify-between pt-8 px-2">
        <TouchableOpacity
          onPress={() => (navigation as any).navigate("Introduction")}
          className="flex items-center justify-center rounded-full bg-blue-500 p-2"
        >
          <ChevronLeft size={32} color="#fff" />
        </TouchableOpacity>

        <Text className="font-extrabold text-4xl mr-12">Lumina</Text>
        <View />
      </View>
      {/* Inputs */}
      <View className="flex-1 flex flex-col items-center justify-center px-8 mt-8">

        {/* Input - Email */}
        <View className="w-full max-w-md flex flex-row gap-3 mt-6 items-center border-neutral-500 border-b-2 ">
          <AtSign size={22} color="#8B8787" />
          <TextInput 
            placeholder="Email" 
            className="flex-1 text-md text-neutral-700 py-5"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Input - Password */}
        <View className="w-full max-w-md flex flex-row gap-3 mt-6 items-center border-neutral-500 border-b-2">
          <KeyRound size={22} color="#8B8787" />
          <TextInput 
            placeholder="Senha" 
            secureTextEntry={!showPassword}
            className="flex-1 text-md text-neutral-700 py-5"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} className="flex-shrink-0">
            {showPassword ? (
              <EyeOff size={22} color="#8B8787" />
            ) : (
              <Eye size={22} color="#8B8787" />
            )}
          </TouchableOpacity>
        </View>

      </View>
      <View className="m-6">
        <TouchableOpacity 
          onPress={handleLogin} 
          className="flex flex-row px-4 items-center justify-between w-full bg-blue-500 py-4 rounded-lg shadow-xl"
        >
          <View />
          <Text className="text-xl text-white font-semibold">Entrar</Text>
          <ArrowBigRightDash size={30} color="#fff" />
        </TouchableOpacity>
        <View className="flex flex-row items-center justify-center">
          <Text className="text-neutral-600 text-center mt-4">Não tem uma conta?</Text>
          <TouchableOpacity 
            onPress={() => (navigation as any).navigate('Register')} 
            className="flex flex-row items-center text-neutral-700 text-center mt-4"
          >
            <Text className="text-blue-500 ms-1 font-medium">Crie uma</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
