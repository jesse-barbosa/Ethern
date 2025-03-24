import { supabase } from "../services/supabase";
import { useState } from "react";
import { ScrollView, View, Text, Image, TextInput, TouchableOpacity, Alert} from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { MaterialIcons } from '@expo/vector-icons';
import Menu from "../components/Menu";
import ConfirmActionModal from "../components/modals/ConfirmActionModal";
import { logoutUser, setUser } from "../slices/userSlice";
import { persistor } from '../store';
import { useNavigation } from "@react-navigation/native";

export default function Settings() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isChanged, setIsChanged] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<'save' | 'delete'>('save');

  const handleLogout = () => {
    dispatch(logoutUser());
    persistor.purge();
    (navigation as any).navigate("Introduction");
  };

  const handleDeleteAccount = () => {
    setModalAction('delete');
    setIsModalVisible(true);
  };

  interface UserData {
    id: number;
    name: string;
    email: string;
  }

  const handleSaveChanges = async (password: string) => {
    // Verificar a senha para garantir que a pessoa tenha permissão para salvar as mudanças
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user?.email!,
      password,
    });
  
    if (error || !data.user) {
      Alert.alert("Erro", "Senha incorreta");
      return;
    }
  
    // Buscanbdo os dados na tabela 'users', utilizando o UUID do 'user.id' retornado da autenticação
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("id, name, email")  // Campos da tabela 'users'
      .eq("user_id", data.user.id)  // Usando o UUID do usuário da tabela interna
      .single();
  
    if (userDataError || !userData) {
      Alert.alert("Erro", "Erro ao buscar dados do usuário.");
      return;
    }
  
    // Atualizando o nome e o email no banco de dados
    const { data: updatedData, error: updateError } = await supabase
      .from("users")
      .update({ name, email })
      .eq("user_id", data.user.id)
      .select()
      .single<UserData>();
  
    if (updateError) {
      Alert.alert("Erro", "Erro ao atualizar dados");
      return;
    }
  
    // Atualiza os dados no Redux e no estado local
    dispatch(setUser(updatedData));
    setName(updatedData.name);
    setEmail(updatedData.email);
    setIsChanged(false);
    
    Alert.alert("Sucesso", "Alterações salvas com sucesso!");
  };
  
  const handleDeactivateUser = async (password: string) => {
    // Tenta autenticar o usuário antes de desativar
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user?.email!,
      password,
    });
  
    if (error || !data.user) {
      Alert.alert("Erro", "Senha incorreta");
      return;
    }
  
    // Desativa a conta do usuário (status = 0)
    const { error: updateError } = await supabase
      .from("users")
      .update({ status: 0 })
      .eq("user_id", data.user.id);
  
    if (updateError) {
      Alert.alert("Erro", "Erro ao desativar conta.");
      return;
    }
  
    // Deleta todas as tarefas associadas ao usuário
    const { error: deleteTasksError } = await supabase
      .from("tasks")
      .delete()
      .eq("user_id", user.id);
  
    if (deleteTasksError) {
      Alert.alert("Erro", "Erro ao excluir tarefas do usuário.");
      console.log('deleteTasksError: ', deleteTasksError)
      return;
    }
  
    Alert.alert("Conta desativada", "Suas tarefas foram apagadas e seu registro será permanentemente deletado dentro dos próximos meses.");
    handleLogout()
  };

  const confirmAction = async (password: string, setLoading: (loading: boolean) => void) => {
    try {
      if (modalAction === 'delete') {
        await handleDeactivateUser(password);
      } else {
        await handleSaveChanges(password);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  return (
    <View className="flex-1">
      <View className="absolute w-full flex flex-row items-start justify-between bg-blue-400 py-8 px-6 h-64 rounded-b-3xl">
        <View className="flex flex-col">
          <Text className="text-4xl text-white font-semibold">Configurações</Text>
          <Text className="text-xl w-3/5 text-neutral-100 font-light">Personalize e gerencie os dados de sua conta Lumina</Text>
        </View>
      </View>
      <ScrollView style={{ paddingTop: 130 }}>
        <View className="flex items-center">
          <Image 
            source={require("../assets/images/userIcon.png")} 
            className="h-48 w-48 rounded-full border-4 border-blue-500" 
          />
        </View>

        <View className="px-6 py-2">
          <View className="w-full flex flex-row gap-3 mt-6 items-center border-b-2 border-neutral-500">
            <MaterialIcons name="account-circle" size={22} color="#8B8787" />
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

          <View className="w-full flex flex-row gap-3 mt-6 items-center border-b-2 border-neutral-500">
            <MaterialIcons name="alternate-email" size={22} color="#8B8787" />
            <TextInput
              placeholder="Email"
              className="flex-1 text-lg text-neutral-800 py-5 opacity-90"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setIsChanged(true);
              }}
              readOnly
            />
          </View>
        </View>

        <View className="px-6 mt-8">
          <TouchableOpacity 
            onPress={() => { setModalAction('save'); setIsModalVisible(true); }}
            disabled={!isChanged}
            className={`${isChanged ? 'opacity-100' : 'opacity-70'} flex flex-row items-center justify-center w-full bg-blue-500 py-4 rounded-lg shadow-xl`}
          >
            <Text className="text-xl text-white font-semibold">Salvar Alterações</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8 border-t-2 border-neutral-400 pt-4 px-2">
          <TouchableOpacity 
            onPress={handleLogout}
            className="flex flex-row items-center justify-center w-full bg-neutral-200 py-8 rounded-xl border-t-0 border border-neutral-400"
          >
            <MaterialIcons name="logout" size={22} color="black" />
            <Text className="text-xl text-black font-semibold ml-4">Sair da Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleDeleteAccount}
            className="flex flex-row items-center justify-center w-full bg-neutral-200 py-8 rounded-xl border-t-0 border mt-1 border-neutral-400"
          >
            <MaterialIcons name="delete" size={22} color="red" />
            <Text className="text-xl text-red-600 font-semibold ml-4">Excluir Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmActionModal 
        visible={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        onConfirm={confirmAction} 
        action={modalAction} 
      />

      <Menu />
    </View>
  );
}
