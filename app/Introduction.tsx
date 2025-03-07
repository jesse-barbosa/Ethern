import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ArrowBigRightDash } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function Introduction() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 py-12 bg-white">
      
      <View className="flex-1 flex items-center justify-center">
        <Image className="w-full h-[600px]" source={require('../assets/images/ilustration.png')} resizeMode="contain" />
      </View>
      
      <View className="px-6">
        <Text className="text-3xl font-bold text-center my-4">
          Gerenciador de tarefas & To-Do List
        </Text>
        <Text className="text-lg text-neutral-600 font-normal text-center p-5">
          Esta ferramenta minimalista foi projetada para ajudar você a gerenciar suas tarefas e hábitos de forma simples
        </Text>
      </View>
      
      <View className="m-6">
        <TouchableOpacity 
          onPress={() => (navigation as any).navigate('Home')} 
          className="flex flex-row px-4 items-center justify-between w-full bg-yellow-200 py-4 rounded-lg shadow-xl"
        >
          <View />
          <Text className="text-xl font-semibold">Entrar</Text>
          <ArrowBigRightDash size={30} color="#000" />
        </TouchableOpacity>
      </View>
      
    </View>
  );
}
