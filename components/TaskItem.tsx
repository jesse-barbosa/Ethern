"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native"
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated"
import { Trash2 } from "lucide-react-native"
import Checkbox from "./Checkbox"
import { format } from 'date-fns';

interface TaskItemProps {
  id: number
  text: string
  completed: boolean
  date: string
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onLongPress?: (id: number) => void
  onPress?: () => void
}

const TaskItem: React.FC<TaskItemProps> = ({
  id,
  text,
  completed,
  date,
  onToggle,
  onDelete,
  onLongPress,
  onPress
}) => {
  // Check if task is overdue
  const isOverdue = () => {
    if (!date || completed) return false
    const taskDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    taskDate.setHours(0, 0, 0, 0)
    return taskDate < today
  }

  return (
    <Pressable
    onPress={onPress}
    onLongPress={() => onLongPress && onLongPress(id)}
    delayLongPress={200}
  >
    <Animated.View
      entering={FadeInRight.duration(300)}
      exiting={FadeOutLeft.duration(200)}
      style={styles.container}
    >
      <View style={styles.content}>
        <Checkbox checked={completed} onToggle={() => onToggle(id)} />
        <View style={styles.textContainer}>
          <Text style={[styles.text, completed && styles.completedText]} numberOfLines={2}>
            {text}
          </Text>
          <Text style={[styles.taskDate, isOverdue() && styles.overdueDate]}>
            {date && !isNaN(new Date(date).getTime()) ? format(new Date(date), 'dd/MM/yyyy') : "Data inválida"}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteButton} activeOpacity={0.7}>
        <Trash2 size={18} color="#9e9e9e" />
      </TouchableOpacity>
    </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2e2e2e",
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#9e9e9e",
  },
  taskDate: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
  },
  overdueDate: {
    fontSize: 12,
    color: "#FF5252",
    fontWeight: "700",
    marginTop: 6,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 6,
  },
})

export default TaskItem
