"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import { X, Calendar } from "lucide-react-native"
import type { Task } from "../../@types/tasks"
import DateTimePicker from "@react-native-community/datetimepicker"

interface AddTaskModalProps {
  action: 'add' | 'edit'
  visible: boolean
  onClose: () => void
  onSubmit: (title: string, message: string, date: Date) => void
  task: Task | null
  selectedDate?: Date
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ action, visible, onClose, onSubmit, task, selectedDate }) => {
  const [taskText, setTaskText] = useState<string>("")
  const [taskDescription, setTaskDescription] = useState<string>("")
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  useEffect(() => {
    if (visible) {
      if (action === 'edit' && task) {
        setTaskText(task.title);
        setTaskDescription(task.message || "");
        setDate(new Date(task.do_at));
      } else {
        setTaskText("");
        setTaskDescription("");
        if(selectedDate) {
          setDate(selectedDate)
        } else {
          setDate(new Date());
        }
      }
    }
  }, [visible, action, task]);  

  const handleAddTask = () => {
    if (taskText.trim() !== "") {
      onSubmit(taskText, taskDescription, date)
      setTaskText("")
      setTaskDescription("")
      setDate(new Date())
      onClose()
    }
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDate(selectedDate)
    }
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flexContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.header}>
                <Text style={styles.modalTitle}>Nova Tarefa</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="O que você precisa fazer?"
                placeholderTextColor="#9e9e9e"
                value={taskText}
                onChangeText={setTaskText}
              />

              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Descrição (opcional)"
                placeholderTextColor="#9e9e9e"
                value={taskDescription}
                onChangeText={setTaskDescription}
                multiline
              />

              <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Calendar size={20} color="#A9DC4D" />
                <Text style={styles.dateText}>{date.toLocaleDateString("pt-BR")}</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                  themeVariant="dark"
                />
              )}

              <TouchableOpacity style={styles.addButton} onPress={handleAddTask} activeOpacity={0.8}>
                <Text style={styles.addButtonText}>
                  {action === 'edit' ? 'Salvar Alterações' : 'Adicionar Tarefa'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: "#121212",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  input: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333333",
    minWidth: "100%",
    textAlignVertical: "top",
  },
  descriptionInput: {
    paddingTop: 16,
    minHeight: 100,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#333333",
  },
  dateText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 12,
  },
  addButton: {
    backgroundColor: "#A9DC4D",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 24 : 0,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
})

export default AddTaskModal
