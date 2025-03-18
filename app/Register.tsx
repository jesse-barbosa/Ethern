import { supabase } from "../services/supabase";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';

export default function Register() {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleRegister = async () => {
    // Criar usuário na autenticação do Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error || !data?.user) {
      Alert.alert("Erro", `Erro ao criar usuário: ${error?.message || "Usuário não encontrado"}`);
      return;
    }
  
    console.log("Usuário criado com sucesso:", data.user);
  
    // Verifica se o usuário já existe na tabela 'users'
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, status")
      .eq("user_id", data.user.id)
      .single();
  
    if (existingUser) {
      // Se o usuário já existe mas está desativado, reativa ele
      const { error: updateError } = await supabase
        .from("users")
        .update({ status: 1 })
        .eq("user_id", data.user.id);
  
      if (updateError) {
        Alert.alert("Erro", "Erro ao reativar conta.");
        return;
      }
    } else {
      // Se não existir, insere um novo registro com status ativo
      const { error: insertError } = await supabase.from("users").insert([
        {
          user_id: data.user.id, // O UUID do usuário criado
          name,
          email,
          status: 1, // Ativo
        },
      ]);
  
      if (insertError) {
        console.error("Erro ao inserir dados adicionais:", insertError.message);
        Alert.alert("Erro", `Erro ao inserir dados adicionais: ${insertError.message}`);
  
        // Rollback: excluir o usuário da autenticação
        await supabase.auth.admin.deleteUser(data.user.id);
        console.log("Usuário removido devido a erro na inserção de dados adicionais.");
  
        return;
      }
    }
  
    // Buscar os dados do usuário na tabela 'users'
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("user_id", data.user.id)
      .single();
  
    if (userError || !userData) {
      Alert.alert("Erro", "Erro ao buscar informações do usuário.");
      return;
    }
  
    console.log("Usuário salvo na Store:", userData);
  
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
          <MaterialIcons name="arrow-circle-left" size={32} color="#fff" />
        </TouchableOpacity>

        <Text className="font-extrabold text-4xl mr-12">Lumina</Text>
        <View />
      </View>
      {/* Inputs */}
      <View className="flex-1 flex flex-col items-center justify-center px-8 mt-8">

        {/* Input - Nome */}
        <View className="w-full max-w-md flex flex-row gap-3 mt-6 items-center border-neutral-500 border-b-2">
          <MaterialIcons name="account-circle" size={22} color="#8B8787" />
          <TextInput
            placeholder="Nome"
            className="flex-1 text-md text-neutral-700 py-5"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Input - Email */}
        <View className="w-full max-w-md flex flex-row gap-3 mt-6 items-center border-neutral-500 border-b-2">
          <MaterialIcons name="alternate-email" size={22} color="#8B8787" />
          <TextInput
            placeholder="Email"
            className="flex-1 text-md text-neutral-700 py-5"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Input - Password */}
        <View className="w-full max-w-md flex flex-row gap-3 mt-6 items-center border-neutral-500 border-b-2">
          <MaterialIcons name="key" size={22} color="#8B8787" />
          <TextInput
            placeholder="Senha"
            secureTextEntry={!showPassword}
            className="flex-1 text-md text-neutral-700 py-5"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} className="flex-shrink-0">
            {showPassword ? (
              <MaterialIcons name="visibility" size={22} color="#8B8787" />
            ) : (
              <MaterialIcons name="visibility-off" size={22} color="#8B8787" />
            )}
          </TouchableOpacity>
        </View>

      </View>
      <View className="m-6">
        <TouchableOpacity 
          onPress={handleRegister} 
          className="flex flex-row px-4 items-center justify-between w-full bg-blue-500 py-4 rounded-lg shadow-xl"
        >
          <View />
          <Text className="text-xl text-white font-semibold">Registrar</Text>
          <MaterialIcons name="arrow-circle-right" size={30} color="#fff" />
        </TouchableOpacity>
        <View className="flex flex-row items-center justify-center">
          <Text className="text-neutral-600 text-center mt-4">Já tem uma conta?</Text>
          <TouchableOpacity 
            onPress={() => (navigation as any).navigate('Login')} 
            className="flex flex-row items-center text-neutral-700 text-center mt-4"
          >
            <Text className="text-blue-500 ms-1 font-medium">Faça Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
