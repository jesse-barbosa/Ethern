"use client"

import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated"
import { Trash2,  ChevronRight, LogOut, User } from "lucide-react-native"
import Header from "../components/Header"
import Menu from "../components/Menu"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../store"
import { supabase } from "../services/supabase"
import { logoutUser, setUser } from "../slices/userSlice"
import { persistor } from "../store"
import { useNavigation } from "@react-navigation/native"
import ConfirmActionModal from "../components/modals/ConfirmActionModal"

const SettingsScreen: React.FC = () => {
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()

  const navigation = useNavigation()

  const [name, setName] = useState(user?.name || "")
  const [isChanged, setIsChanged] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalAction, setModalAction] = useState<"save" | "delete">("save")

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

  const handleLogout = () => {
    dispatch(logoutUser());
    persistor.purge();
    (navigation as any).navigate("Introduction")
  }

  const handleDeleteAccount = () => {
    setModalAction("delete")
    setIsModalVisible(true)
  }

  const handleSaveChanges = async (password: string) => {
    const { data, error } = await supabase.auth.signIn({
      email: user?.email!,
      password,
    })

    if (error || !data.user) {
      Alert.alert("Erro", "Senha incorreta")
      return
    }

    const { data: updatedData, error: updateError } = await supabase
      .from("users")
      .update({ name })
      .eq("user_id", data.user.id)
      .select()
      .single()

    if (updateError) {
      Alert.alert("Erro", "Erro ao atualizar dados")
      return
    }

    dispatch(setUser(updatedData))
    setName(updatedData.name)
    setIsChanged(false)
    Alert.alert("Sucesso", "Alterações salvas com sucesso!")
  }

  const handleDeactivateUser = async (password: string) => {
    const { data, error } = await supabase.auth.signIn({
      email: user?.email!,
      password,
    })

    if (error || !data.user) {
      Alert.alert("Erro", "Senha incorreta")
      return
    }

    await supabase.from("users").update({ status: 0 }).eq("user_id", data.user.id)
    await supabase.from("tasks").delete().eq("user_id", user.id)

    Alert.alert(
      "Conta desativada",
      "Suas tarefas foram apagadas e seu registro será permanentemente deletado dentro dos próximos meses."
    )

    handleLogout()
  }

  const confirmAction = async (password: string, setLoading: (loading: boolean) => void) => {
    try {
      if (modalAction === "delete") {
        await handleDeactivateUser(password)
      } else {
        await handleSaveChanges(password)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setIsModalVisible(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView style={styles.content}>
        <Animated.View entering={FadeIn.duration(500)}>
          <Text style={styles.sectionTitle}>Minha Conta</Text>
          <View style={styles.card}>
            <View style={styles.inputItem}>
              <User size={22} color="#A9DC4D" />
              <TextInput
                placeholder="Nome"
                placeholderTextColor="#888"
                style={styles.input}
                value={name}
                onChangeText={(text) => {
                  setName(text)
                  setIsChanged(true)
                }}
              />
            </View>

            <View style={styles.inputItem}>
              <ChevronRight size={22} color="#A9DC4D" />
              <Text style={[styles.input, { color: "#999" }]}>{user.email}</Text>
            </View>

            {isChanged && (
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: "#A9DC4D" }]}
                onPress={() => {
                  setModalAction("save")
                  setIsModalVisible(true)
                }}
              >
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sectionTitle}>Dados</Text>
          <View style={styles.card}>
            <AnimatedTouchableOpacity
              entering={FadeInRight.delay(300).duration(500)}
              style={styles.settingItem}
              onPress={handleDeleteAccount}
            >
              <View style={styles.settingInfo}>
                <Trash2 size={22} color="#ff6b6b" />
                <Text style={styles.settingText}>Excluir Conta</Text>
              </View>
              <ChevronRight size={20} color="#9e9e9e" />
            </AnimatedTouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeIn.duration(500)} style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#fff" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Ethern v1.0.0</Text>
        </View>
      </Animated.View>

      <View style={styles.menuContainer}>
        <Menu />
      </View>

      <ConfirmActionModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={confirmAction}
        action={modalAction}
      />
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#121212",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333333",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 12,
  },
  inputItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  input: {
    marginLeft: 12,
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
  },
  saveButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333333",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  logoutContainer: {
    padding: 20,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: "center",
    marginVertical: 30,
    marginBottom: 25,
  },
  versionText: {
    fontSize: 14,
    color: "#9e9e9e",
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
  },
})

export default SettingsScreen