import { supabase } from "../services/supabase";
import { View, Text, TouchableOpacity } from 'react-native';
import DraggableFlatList from "react-native-draggable-flatlist";
import { ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MaterialIcons } from '@expo/vector-icons';
import Menu from "../components/Menu";
import TaskModal from '../components/modals/TaskModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  message: string;
  status: boolean;
}

export default function Home() {
  const user = useSelector((state: RootState) => state.user);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState<'create' | 'edit'>('create');
  const [selectedEditTaskId, setSelectedEditTaskId] = useState<number | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedDeleteTaskId, setSelectedDeleteTaskId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    setLoading(true);
    const { data: fetchedTasks, error }: { data: Task[] | null; error: any } = await supabase
      .from('tasks')
      .select('id, title, message, status')
      .eq('user_id', user.id)
      .order('position', { ascending: true });
  
    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(fetchedTasks ? fetchedTasks.sort((a, b) => Number(a.status) - Number(b.status)) : []);
    }
    setLoading(false);
  };
  

  const updateTaskPositions = async (newTasks: Task[]) => {
    setDragging(true);
    setTasks(newTasks);
  
    const updatePromises = newTasks.map((task: Task, index: number) => 
      supabase
        .from('tasks')
        .update({ position: index + 1 })
        .eq('id', task.id)
    );
  
    const results = await Promise.all(updatePromises);
  
    results.forEach(({ error }) => {
      if (error) console.error('Error updating positions:', error);
    });
  
    setDragging(false);
  };

  const handleDragEnd = ({ data }: { data: Task[] }) => {
    updateTaskPositions(data);
  };

  const changeStatus = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    
    const newStatus = task.status ? 0 : 1;
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) fetchTasks();
  };

  const confirmTask = async (title: string, message: string) => {
    if (action === 'edit' && selectedEditTaskId) {
      const { error } = await supabase
        .from('tasks')
        .update({ title, message })
        .eq('id', selectedEditTaskId);
      if (!error) fetchTasks();
    } else {
      const { error } = await supabase
        .from('tasks')
        .insert([{ title, message, status: 0, user_id: user.id }]);
      if (!error) fetchTasks();
    }
    setIsModalVisible(false);
    setSelectedEditTaskId(null);
  };

  const handleEditPress = (title: string, message: string, id: number) => {
    setSelectedEditTaskId(id);
    setAction('edit');
    setIsModalVisible(true);
  };

  const handleCreatePress = () => {
    setAction('create');
    setIsModalVisible(true);
  };

  const handleDeletePress = (id: number) => {
    setSelectedDeleteTaskId(id);
    setIsDeleteModalVisible(true);
  };

  const confirmDeleteTask = async () => {
    if (!selectedDeleteTaskId) return;
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', selectedDeleteTaskId);
    
    if (!error) {
      fetchTasks();
      setIsDeleteModalVisible(false);
    }
  };

  const getFirstName = (name: string) => {
    const parts = name.split(' ');
    return parts[0];
  }
  
  return (
    <View className="flex-1">
      <View className="absolute w-full flex flex-row items-start justify-between bg-blue-400 py-8 px-6 h-64 rounded-b-3xl">
        <View className="flex flex-col">
          <Text className="text-4xl text-white font-semibold">Bem-vindo :)</Text>
          <Text className="text-xl text-neutral-100 font-light">Tenha um bom dia, {getFirstName(user.name)}!</Text>
        </View>
      </View>

      <View className="flex-1 mt-32 pb-20">
        <Text className="text-4xl text-white text-center my-5 font-medium"
          style={{
            textShadowColor: 'rgba(0, 0, 0, 0.2)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          }}>
          Minhas Tarefas
        </Text>

        {loading ? (
          <View className="flex-1 items-center justify-center w-full p-6 my-6">
            <View className="flex flex-row items-center px-6 py-4 rounded-lg">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-xl font-semibold text-neutral-800 ml-4 animate-pulse">
                Carregando tarefas...
              </Text>
            </View>
          </View>
        ) : tasks.length === 0 ? (
          <View className="bg-white flex flex-col items-center w-full p-6 my-6 rounded-xl shadow-md">
            <View className="bg-green-100 p-2 rounded-full">
              <MaterialIcons name="check-circle" size={28} color={'#4CAF50'} />
            </View>
            <Text className="text-xl my-2 font-semibold text-neutral-800">Nenhuma tarefa pendente</Text>
            <Text className="text-neutral-500 text-center">
              Você concluiu todas as tarefas. Aproveite seu tempo com eficiência!
            </Text>
          </View>
        ) : dragging ? (
            <View className="flex-1 flex flex-row items-center justify-center w-full p-2">
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text className="text-neutral-500 ml-2">Atualizando posições...</Text>
            </View>
          ) : (
          <DraggableFlatList
            className="px-2"
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            onDragEnd={handleDragEnd}
            renderItem={({ item, drag }) => (
              <TouchableOpacity
                onLongPress={drag}
                onPress={() => handleEditPress(item.title, item.message, item.id)}
                className={`bg-white flex flex-row items-center w-full p-6 mb-2 rounded-xl shadow-lg ${item.status ? 'opacity-70' : ''}`}
              >
                <TouchableOpacity onPress={() => changeStatus(item.id)}>
                  {item.status ? (
                    <MaterialIcons name="check-box" size={24} color={'#0AC600'} />
                  ) : (
                    <MaterialIcons name="check-box-outline-blank" size={24} color={'#000'} />
                  )}
                </TouchableOpacity>

                <View className="flex flex-col w-5/6 ms-3">
                  <Text className={`text-xl mb-1 ${item.status ? 'line-through' : ''}`}>
                    {item.title}
                  </Text>
                  {item.message.length > 0 && (
                    <Text className={`text-lg font-light text-neutral-600 ${item.status ? 'line-through' : ''}`}>
                      {item.message}
                    </Text>
                  )}
                </View>

                <TouchableOpacity onPress={() => handleDeletePress(item.id)} className="flex items-center justify-center rounded-full">
                  <MaterialIcons name="delete" size={24} color={'#FF4646'} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <TouchableOpacity onPress={() => handleCreatePress()} className="bg-blue-500 flex items-center justify-center absolute bottom-24 right-6 p-4 rounded-full shadow-lg">
        <MaterialIcons name="add" size={36} color='#fff'/>
      </TouchableOpacity>

      <Menu />

      {/* Modals */}
      <TaskModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        action={action}
        onConfirm={confirmTask}
        editTitle={action === 'edit' ? tasks.find(task => task.id === selectedEditTaskId)?.title : ''}
        editMessage={action === 'edit' ? tasks.find(task => task.id === selectedEditTaskId)?.message : ''}
      />

      <ConfirmDeleteModal
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onConfirm={confirmDeleteTask}
      />
    </View>
  );
}
