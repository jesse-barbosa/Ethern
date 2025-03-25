import { useState, useEffect } from 'react';
import { supabase } from "../services/supabase";
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import Menu from "../components/Menu";

export default function Notations() {
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const [notations, setNotations] = useState<{ id: number, title: string; }[]>([]);

  useEffect(() => {
    fetchNotations();
  }, []);

  // Fetch notations from Supabase
  const fetchNotations = async () => {
    const { data: fetchedNotations, error } = await supabase
      .from('notations')
      .select('id, title')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching notations:', error);
    } else {
      setNotations(fetchedNotations);
    }
  };

  const confirmNotation = async () => {
    const { data, error } = await supabase
      .from('notations')
      .insert([{ user_id: user.id }])
      .select();

    if (error) {
      console.error('Error inserting new notation:', error);
    } else if (data && data.length > 0) {
      const newNotationId = data[0].id;
      (navigation as any).navigate('ViewNotation', { id: newNotationId });
      fetchNotations();
    }
  };

  const handleNotationPress = (id: number) => {
    (navigation as any).navigate('ViewNotation', { id });
  };

  const handleCreatePress = () => {
    confirmNotation();
  };

  return (
    <View className="flex-1">
      <ScrollView style={{ flex: 1 }}>
      <View className="absolute w-full flex flex-row items-start justify-between bg-blue-400 py-8 px-6 h-64 rounded-b-3xl">
        <View className="flex flex-col">
          <View className="flex flex-row w-full justify-between items-center">
            <Text className="text-4xl text-white font-semibold">Anotações</Text>
          </View>
          <Text className="text-xl text-neutral-100 font-light">Escreva sobre o seu dia ou salve informações importantes</Text>
        </View>
      </View>
        <Text className="mt-44 text-4xl text-white text-center my-5 font-medium"
          style={{
            textShadowColor: 'rgba(0, 0, 0, 0.2)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          }}>Minhas Anotações</Text>
        <View className="px-3 gap-2">
          {notations.length === 0 ? (
            <View className="bg-white flex flex-col items-center w-full p-6 my-6 rounded-xl shadow-md">
              <View className="bg-blue-100 p-2 rounded-full">
                <MaterialIcons name="note-add" size={28} color={'#007BFF'} />
              </View>
              <Text className="text-xl my-2">Nenhuma anotação encontrada.</Text>
              <Text className="text-neutral-500 text-center">Crie uma nova anotação para começar!</Text>
            </View>
            ) : (
            notations.map((notation, index) => (
            <TouchableOpacity
            onPress={() => handleNotationPress(notation.id)}
              key={index}
              className="bg-white flex flex-row items-center w-full p-6 rounded-xl shadow-lg border-s-4 border-blue-500"
            >
              <Text className="w-11/12 text-xl mb-1">{notation.title}</Text>
              <MaterialIcons className="ms-3" name="chevron-right" size={24} color={'#000'} />
            </TouchableOpacity>
          ))
          )}
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => handleCreatePress()} className="bg-blue-500 flex items-center justify-center absolute bottom-24 right-6 p-4 rounded-full shadow-lg">
        <MaterialIcons name="add" size={36} color='#fff'/>
      </TouchableOpacity>
      <Menu />
    </View>
  );
}
