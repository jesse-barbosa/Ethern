"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "../services/supabase";
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from "react-native"
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"
import type { Task } from "../@types/tasks"
import Header from "../components/Header"
import Menu from "../components/Menu"
import TaskItem from "../components/TaskItem"
import TaskModal from "../components/modals/TaskModal"
import { CheckCheck, Plus } from "lucide-react-native"

const TasksScreen: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [modalVisible, setModalVisible] = useState(false)
  
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [action, setAction] = useState<'add' | 'edit'>('add');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const ITEM_HEIGHT = 50;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    const { data: fetchedTasks, error }: { data: Task[] | null; error: any } = await supabase
      .from('tasks')
      .select('id, title, message, status, do_at, created_at')
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

  const toggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    
    const newStatus = task.status ? 0 : 1;
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) fetchTasks();
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (!error) {
      fetchTasks();
    }
  };

  const handleTask = async (title: string, message: string, date: Date) => {
    if (action === 'add') {
      const { error } = await supabase
        .from('tasks')
        .insert([{ title, message, status: 0, do_at: date, user_id: user.id }]);
      if (!error) fetchTasks();
    } else if (action === 'edit' && selectedTask) {
      const { error } = await supabase
        .from('tasks')
        .update({ title, message, do_at: date })
        .eq('id', selectedTask.id);
      if (!error) fetchTasks();
    }
    setModalVisible(false);
  };

  const renderItem = ({ item, drag }) => (
    <ScaleDecorator>
      <TaskItem
        id={item.id}
        text={item.title}
        completed={item.status === 1}
        date={item.do_at}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onLongPress={drag}
        onPress={() => {
          setAction('edit');
          setSelectedTask(item);
          setModalVisible(true);
        }}
      />
    </ScaleDecorator>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Ordit"
        showAddButton={true}
        onAddPress={() => {
          setAction('add');
          setSelectedTask(null);
          setModalVisible(true);
        }}
      />
      <Animated.View entering={FadeIn.duration(100)} style={styles.content}>
        {loading ? (
          <Animated.View entering={FadeIn.duration(100)} style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </Animated.View>
        ) : tasks.length > 0 ? (
          <DraggableFlatList
            data={tasks}
            onDragEnd={({ data }) => updateTaskPositions(data)}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            keyExtractor={(item) => item.id.toString()}
            getItemLayout={(data, index) => (
              { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
            )}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        ) : (
          <Animated.View entering={FadeIn.duration(400)} style={styles.emptyStateContainer}>
            <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.emptyStateIconContainer}>
              <CheckCheck color="#A9DC4D" size={64} />
            </Animated.View>
    
            <Animated.View entering={FadeInDown.duration(600).delay(400)}>
              <Text style={styles.emptyStateTitle}>Tudo limpo por aqui!</Text>
              <Text style={styles.emptyStateSubtitle}>Você não tem nenhuma tarefa pendente</Text>
            </Animated.View>
    
            <Animated.View entering={FadeInDown.duration(600).delay(600)}>
              <TouchableOpacity style={styles.emptyStateButton} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
                <Plus color="#000000" size={20} />
                <Text style={styles.emptyStateButtonText}>Adicionar tarefa</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}
      </Animated.View>
      <View style={styles.modal}>
        <TaskModal
          action={action}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleTask}
          task={selectedTask}
        />
      </View>
      <Menu />
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 20,
  },
  modal: {
    position: 'absolute',
    top: 0,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyStateIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(169, 220, 77, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#AAAAAA",
    textAlign: "center",
    marginBottom: 32,
  },
  emptyStateButton: {
    flexDirection: "row",
    backgroundColor: "#A9DC4D",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
})

export default TasksScreen