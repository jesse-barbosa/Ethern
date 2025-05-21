import React, { useState } from "react"
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native"

interface ConfirmActionModalProps {
  visible: boolean
  onCancel: () => void
  onConfirm: (password: string, setLoading: (loading: boolean) => void) => void
  action: "delete" | "save"
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  action,
}) => {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = () => {
    setIsLoading(true)
    onConfirm(password, setIsLoading)
    setPassword("")
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Digite sua senha para confirmar</Text>

          <TextInput
            secureTextEntry
            placeholder="Senha"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
            style={styles.input}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onCancel}
              disabled={isLoading}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isLoading}
              style={[styles.button, action === "delete" ? styles.deleteButton : styles.saveButton]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmText}>
                  {action === "delete" ? "Excluir" : "Salvar"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    borderWidth: 1,
    borderColor: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#555",
    paddingVertical: 10,
    fontSize: 16,
    color: "#fff",
    marginBottom: 30,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#333",
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#A9DC4D",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
  },
  confirmText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
})

export default ConfirmActionModal
