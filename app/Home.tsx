import { supabase } from "../services/supabase";
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MaterialIcons } from '@expo/vector-icons';
import Menu from "../components/Menu";
import TaskModal from '../components/modals/TaskModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { useState, useEffect } from 'react';

export default function Home() {
  const user = useSelector((state: RootState) => state.user);
  const [tasks, setTasks] = useState<{ id: number, title: string; message: string; status: boolean; }[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState<'create' | 'edit'>('create');
  const [selectedEditTaskId, setSelectedEditTaskId] = useState<number | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedDeleteTaskId, setSelectedDeleteTaskId] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    const { data: fetchedTasks, error } = await supabase
      .from('tasks')
      .select('id, title, message, status')
      .eq('user_id', user.id);
  
    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      // Sort tasks: First, tasks with status 0, then tasks with status 1
      const sortedTasks = fetchedTasks.sort((a, b) => a.status - b.status);
      setTasks(sortedTasks);
    }
  };  

  const changeStatus = async (id: number) => {
    // Verify if task exists
    const task = tasks.find((t) => t.id === id);
    
    if (!task) {
      console.error('Task not found');
      return;
    }
  
    // Invert value (0 or 1)
    const newStatus = task.status ? 0 : 1;
  
    const { data: response, error } = await supabase
      .from('tasks')
      .update({ status: newStatus }) // Updating with inverse status
      .eq('id', id);
  
    if (error) {
      console.error('Error updating task status:', error);
    } else {
      fetchTasks();
    }
  };

  const confirmTask = async (title: string, message: string) => {
    if (action === 'edit') {
      if (!selectedEditTaskId) return;
  
      const { error } = await supabase
        .from('tasks')
        .update({ title, message })
        .eq('id', selectedEditTaskId);
  
      if (error) {
        console.error('Error updating task:', error);
      } else {
        fetchTasks();
      }
    } else {
      const { error } = await supabase
        .from('tasks')
        .insert([{ title, message, status: 0, user_id: user.id }]);
  
      if (error) {
        console.error('Error inserting new task:', error);
      } else {
        fetchTasks();
      }
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
  
    const { data: response, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', selectedDeleteTaskId);
  
    if (error) {
      console.error('Error deleting task:', error);
    } else {
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
      <ScrollView style={{ paddingTop: 110 }}>
      <Text className="text-4xl text-white text-center my-5 font-medium"
          style={{
            textShadowColor: 'rgba(0, 0, 0, 0.2)', // Shadow with transparency
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          }}>Minhas Tarefas</Text>
        <View className="px-3 gap-2">
          {tasks.length === 0 ? (
            <View className="bg-white flex flex-col items-center w-full p-6 my-6 rounded-xl shadow-md">
              <View className="bg-green-100 p-2 rounded-full">
                <MaterialIcons name="check-circle" size={28} color={'#4CAF50'} />
              </View>
              <Text className="text-xl my-2 font-semibold text-neutral-800">Nenhuma tarefa pendente</Text>
              <Text className="text-neutral-500 text-center">Você concluiu todas as tarefas. Aproveite seu tempo com eficiência!</Text>
            </View>
            ) : (
            tasks.map((task, index) => (
            <TouchableOpacity
            onPress={() => handleEditPress(task.title, task.message, task.id)}
              key={index}
              className={`bg-white flex flex-row items-center w-full p-6 rounded-xl shadow-lg ${task.status ? 'opacity-70' : ''}`}
            >
              <TouchableOpacity onPress={() => changeStatus(task.id)}>
                {task.status ? (
                  <MaterialIcons name="check-box" size={24} color={'#0AC600'} />
                ) : (
                  <MaterialIcons name="check-box-outline-blank" size={24} color={'#000'} />
                )}
              </TouchableOpacity>

              <View className="flex flex-col w-5/6 ms-3">
                <Text className={`text-xl mb-1 ${task.status ? 'line-through' : ''}`}>{task.title}</Text>
                {task.message.length > 0 && (
                  <Text className={`text-lg font-light text-neutral-600 ${task.status ? 'line-through' : ''}`}>
                    {task.message}
                  </Text>
                )}
              </View>

              <TouchableOpacity onPress={() => handleDeletePress(task.id)} className="flex items-center justify-center rounded-full">
                <MaterialIcons name="delete" size={24} color={'#FF4646'} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
          )}
        </View>
      </ScrollView>
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