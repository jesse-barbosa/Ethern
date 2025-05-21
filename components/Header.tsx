import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Animated, { FadeInDown } from "react-native-reanimated"
import { Plus } from "lucide-react-native"

interface HeaderProps {
  title: string
  showAddButton?: boolean
  onAddPress?: () => void
}

const Header: React.FC<HeaderProps> = ({ title, showAddButton = false, onAddPress }) => {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <Animated.View entering={FadeInDown.duration(500).springify()} style={styles.container}>
        <View style={styles.titleContainer}>
          <Image source={require("../assets/icon.png")} style={styles.logo} />
          <Text style={styles.title}>{title}</Text>
        </View>

        {showAddButton && (
          <TouchableOpacity style={styles.addButton} onPress={onAddPress} activeOpacity={0.7}>
            <Plus size={22} color="#000000" />
          </TouchableOpacity>
        )}
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#000000",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    marginRight: 12,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A9DC4D",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default Header
