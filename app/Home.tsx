import { supabase } from "../services/supabase";
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { CheckCheck, Square, SquareCheck, Trash2, Plus } from 'lucide-react-native';
import Header from "../components/Header";
import Menu from "../components/Menu";
import { useState, useEffect } from 'react';

export default function Home() {
  const user = useSelector((state: RootState) => state.user);
  const [tasks, setTasks] = useState<{ id: number, title: string; message: string; status: boolean; }[]>([]);

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
      setTasks(fetchedTasks || []);
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

  const deleteTask = async (id: number) => {
    // Verify if task exists
    const task = tasks.find((t) => t.id === id);
    
    if (!task) {
      console.error('Task not found');
      return;
    }
  
    const { data: response, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
  
    if (error) {
      console.error('Error deleting task:', error);
    } else {
      fetchTasks();
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        <Header />
        <View className="px-3 gap-2">
          <Text className="text-3xl text-center my-4">Tarefas</Text>
          {tasks.length === 0 ? (
              <View className="bg-white flex flex-col items-center w-full p-6 my-6 rounded-xl shadow-md">
                <CheckCheck size={32} color={'#000'} />
                <Text className="text-xl mb-1">Nada a fazer!</Text>
            </View>
            ) : (
            tasks.map((task, index) => (
            <TouchableOpacity
              key={index}
              className={`bg-white flex flex-row items-center w-full p-6 rounded-xl shadow-lg ${task.status ? 'opacity-70' : ''}`}
            >
              <TouchableOpacity onPress={() => changeStatus(task.id)}>
                {task.status ? (
                  <SquareCheck size={24} color={'#0AC600'} />
                ) : (
                  <Square size={24} color={'#000'} />
                )}
              </TouchableOpacity>

              <View className="flex flex-col w-5/6 ms-2">
                <Text className={`text-xl mb-1 ${task.status ? 'line-through' : ''}`}>{task.title}</Text>
                <Text className={`text-lg font-light text-neutral-600 ${task.status ? 'line-through' : ''}`}>{task.message}</Text>
              </View>

              <TouchableOpacity onPress={() => deleteTask(task.id)} className="flex items-center justify-center rounded-full">
                <Trash2 size={24} color={'#FF4646'} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
          )}
        </View>
      </ScrollView>
      <TouchableOpacity className="bg-blue-500 flex items-center justify-center absolute bottom-32 right-6 p-4 rounded-full shadow-lg">
        <Plus size={36} color='#fff'/>
      </TouchableOpacity>
      <Menu />
    </View>
  );
}