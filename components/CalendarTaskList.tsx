"use client"

import React, { useState } from "react"
import { View, Text, StyleSheet, FlatList } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import type { Task } from "../@types/tasks"
import TaskItem from "./TaskItem"

interface CalendarTaskListProps {
  date: Date
  tasks: Task[]
  onToggleTask: (id: number) => void
  onDeleteTask: (id: number) => void
  setAction: 'add' | 'edit',
  setSelectedTask: Task | null,
  setModalVisible: boolean
}

const CalendarTaskList: React.FC<CalendarTaskListProps> = ({ date, tasks, onToggleTask, onDeleteTask, setAction, setSelectedTask, setModalVisible }) => {
  const formattedDate = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return (
    <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} style={styles.container}>
      <Text style={styles.date}>{capitalizedDate}</Text>

      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TaskItem
              id={item.id}
              text={item.title}
              completed={item.status === 1}
              date={item.do_at}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              onPress={() => {
                setAction('edit');
                setSelectedTask(item);
                setModalVisible(true);
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma tarefa para este dia</Text>
        </View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    textTransform: "capitalize",
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#9e9e9e",
    textAlign: "center",
  },
})

export default CalendarTaskList
