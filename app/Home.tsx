import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Square, SquareCheck, Plus } from 'lucide-react-native';
import Header from "../components/Header";
import Menu from "../components/Menu";

export default function Home() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
      <Header />
        <View className="px-3 gap-2">
          {/* Tasks */}
          <Text className="text-3xl font-light my-4">Tarefas</Text>

          <TouchableOpacity className="bg-white flex flex-row items-center w-full p-6 rounded-xl shadow-lg">
            <Square size={24} color={'#000'}/>
            <View className="flex flex-col ms-4">
              <Text className="text-xl mb-1">[ Nome da Tarefa ]</Text>
              <Text className="text-lg font-light text-neutral-600">[ Descrição da Tarefa ]</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white flex flex-row items-center w-full p-6 rounded-xl shadow-lg">
            <Square size={24} color={'#000'}/>
            <View className="flex flex-col ms-4">
              <Text className="text-xl mb-1">[ Nome da Tarefa ]</Text>
              <Text className="text-lg font-light text-neutral-600">[ Descrição da Tarefa ]</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="opacity-70 bg-white flex flex-row items-center w-full p-6 rounded-xl shadow-lg">
            <SquareCheck size={24} color={'#0DFF00'}/>
            <View className="flex flex-col ms-4">
              <Text className="text-xl mb-1 line-through">[ Nome da Tarefa ]</Text>
              <Text className="text-lg font-light text-neutral-600 line-through">[ Descrição da Tarefa ]</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity className="bg-blue-500 flex items-center justify-center absolute bottom-32 right-6 p-4 rounded-full shadow-lg">
        <Plus size={36} color='#fff'/>
      </TouchableOpacity>
      <Menu />
    </View>
  );
}