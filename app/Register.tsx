"use client"

import { supabase } from "../services/supabase"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { setUser } from "../slices/userSlice"
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native"
import { MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"

export default function Register() {
  const navigation = useNavigation()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()

  const handleRegister = async () => {
    // Criar usuário na autenticação do Supabase
    const { user, session, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error || !user) {
      Alert.alert("Erro", `Erro ao criar usuário: ${error?.message || "Usuário não encontrado"}`)
      return
    }

    console.log("Usuário criado com sucesso:", user)

    // Verifica se o usuário já existe na tabela 'users'
    const { data: existingUser } = await supabase.from("users").select("id, status").eq("user_id", user.id).single()

    if (existingUser) {
      // Se o usuário já existe mas está desativado, reativa ele
      const { error: updateError } = await supabase.from("users").update({ status: 1 }).eq("user_id", user.id)

      if (updateError) {
        Alert.alert("Erro", "Erro ao reativar conta.")
        return
      }
    } else {
      // Se não existir, insere um novo registro com status ativo
      const { error: insertError } = await supabase.from("users").insert([
        {
          user_id: user.id, // O UUID do usuário criado
          name,
          email,
          status: 1, // Ativo
        },
      ])

      if (insertError) {
        console.error("Erro ao inserir dados adicionais:", insertError.message)
        Alert.alert("Erro", `Erro ao inserir dados adicionais: ${insertError.message}`)

        // Rollback: excluir o usuário da autenticação
        await supabase.auth.admin.deleteUser(user.id)
        console.log("Usuário removido devido a erro na inserção de dados adicionais.")

        return
      }
    }

    // Buscar os dados do usuário na tabela 'users'
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("user_id", user.id)
      .single()

    if (userError || !userData) {
      Alert.alert("Erro", "Erro ao buscar informações do usuário.")
      return
    }

    console.log("Usuário salvo na Store:", userData)

    // Salva usuário no Redux
    dispatch(setUser(userData));

    // Redireciona para a Home
    (navigation as any).navigate("Home");
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
        <TouchableOpacity onPress={() => (navigation as any).navigate("Introduction")} style={styles.backButton}>
          <MaterialIcons name="chevron-left" size={32} color="#000" />
        </TouchableOpacity>

        <Animated.Text entering={FadeInDown.duration(600).delay(200)} style={styles.appName}>
          Ethern
        </Animated.Text>
        <View />
      </Animated.View>

      {/* Inputs */}
      <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.inputContainer}>
        {/* Input - Nome */}
        <View style={styles.inputWrapper}>
          <MaterialIcons name="account-circle" size={22} color="#a3a3a3" />
          <TextInput
            placeholder="Nome"
            placeholderTextColor="#a3a3a3"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Input - Email */}
        <View style={styles.inputWrapper}>
          <MaterialIcons name="alternate-email" size={22} color="#a3a3a3" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#a3a3a3"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Input - Password */}
        <View style={styles.inputWrapper}>
          <MaterialIcons name="key" size={22} color="#a3a3a3" />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#a3a3a3"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.visibilityButton}>
            {showPassword ? (
              <MaterialIcons name="visibility" size={22} color="#a3a3a3" />
            ) : (
              <MaterialIcons name="visibility-off" size={22} color="#a3a3a3" />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Button Section */}
      <Animated.View entering={FadeInDown.duration(600).delay(500)} style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRegister} style={styles.button} activeOpacity={0.85}>
          <LinearGradient
            colors={["#A9DC4D", "#8BC34A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <View />
            <Text style={styles.buttonText}>Registrar</Text>
            <MaterialIcons name="arrow-circle-right" size={30} color="#121212" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => (navigation as any).navigate("Login")} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Faça Login</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "#A9DC4D",
    padding: 8,
  },
  appName: {
    fontWeight: "800",
    fontSize: 32,
    color: "#A9DC4D",
    marginRight: 48,
    letterSpacing: 1,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginTop: 32,
  },
  inputWrapper: {
    width: "100%",
    maxWidth: 400,
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    paddingVertical: 12,
  },
  visibilityButton: {
    flexShrink: 0,
  },
  buttonContainer: {
    margin: 24,
  },
  button: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#A9DC4D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "#121212",
    fontSize: 18,
    fontWeight: "700",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  loginText: {
    color: "#a3a3a3",
    textAlign: "center",
  },
  loginLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginLinkText: {
    color: "#A9DC4D",
    marginLeft: 4,
    fontWeight: "500",
  },
})
