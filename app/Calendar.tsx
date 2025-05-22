"use client"

import type React from "react"
import { supabase } from "../services/supabase";
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useState, useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { Calendar } from "react-native-calendars"
import Animated, { FadeIn } from "react-native-reanimated"
import type { Task } from "../@types/tasks"
import Header from "../components/Header"
import Menu from "../components/Menu"
import CalendarTaskList from "../components/CalendarTaskList"
import { TouchableOpacity } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskModal from "../components/modals/TaskModal"
import { Plus } from "lucide-react-native"

const CalendarScreen: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);

  const [action, setAction] = useState<'add' | 'edit'>('add');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [modalVisible, setModalVisible] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    fetchTasks();
  }, []);

  // Load tasks from Supabase
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

  // Format tasks for calendar marking
  const getMarkedDates = () => {
    const markedDates: any = {}

    tasks.forEach((task) => {
      if(task.do_at){
        const dateString = task.do_at.split("T")[0]
        if (!markedDates[dateString]) {
          markedDates[dateString] = {
            marked: true,
            dotColor: "#A9DC4D",
          }
        }
      }
    })

    // Add selected date
    const selectedDateString = selectedDate.toISOString().split("T")[0]
    markedDates[selectedDateString] = {
      ...markedDates[selectedDateString],
      selected: true,
      selectedColor: "#333333",
    }

    return markedDates
  }

  // Filter tasks for selected date
  const getTasksForSelectedDate = () => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.do_at)
      return (
        taskDate.getDate() === selectedDate.getDate() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getFullYear() === selectedDate.getFullYear()
      )
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
       title="Calendário"
       showAddButton={true}
       onAddPress={() => {
        setAction('add');
        setSelectedTask(null);
        setModalVisible(true);
       }}
      />

      <Animated.View entering={FadeIn.duration(500)} style={styles.content}>
        <Calendar
          theme={{
            backgroundColor: "#000000",
            calendarBackground: "#121212",
            textSectionTitleColor: "#FFFFFF",
            selectedDayBackgroundColor: "#A9DC4D",
            selectedDayTextColor: "#000000",
            todayTextColor: "#A9DC4D",
            dayTextColor: "#FFFFFF",
            textDisabledColor: "#666666",
            dotColor: "#A9DC4D",
            selectedDotColor: "#000000",
            arrowColor: "#A9DC4D",
            monthTextColor: "#FFFFFF",
            indicatorColor: "#A9DC4D",
            textDayFontWeight: "300",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "500",
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
          markedDates={getMarkedDates()}
          onDayPress={(day) => {
            const [year, month, dayNum] = day.dateString.split('-').map(Number);
            // Force the time to 12:00 PM, preventing offset to previous day
            const safeDate = new Date(year, month - 1, dayNum, 12);
            setSelectedDate(safeDate);
          }}
          
          enableSwipeMonths={true}
          style={styles.calendar}
        />

        <CalendarTaskList
          date={selectedDate}
          tasks={getTasksForSelectedDate()}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          setAction={setAction}
          setSelectedTask={setSelectedTask}
          setModalVisible={setModalVisible}
        />
      </Animated.View>

      <Menu />

      <View style={styles.modal}>
        <TaskModal
          action={action}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleTask}
          task={selectedTask}
          selectedDate={selectedDate}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#A9DC4D",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modal: {
    position: 'absolute',
    top: 0,
  },
})

export default CalendarScreen
