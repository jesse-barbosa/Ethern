import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { CheckSquare, Calendar, Settings } from "lucide-react-native"
import Animated, { FadeInUp } from "react-native-reanimated"

const BottomMenu: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const currentRoute = route.name

  const menuItems = [
    {
      name: "Tarefas",
      icon: CheckSquare,
      route: "Home",
    },
    {
      name: "Calendário",
      icon: Calendar,
      route: "Calendar",
    },
    {
      name: "Config",
      icon: Settings,
      route: "Settings",
    },
  ]

  return (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.container}>
      <View style={styles.menuContent}>
        {menuItems.map((item, index) => {
          const isActive = currentRoute === item.route
          const IconComponent = item.icon

          return (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.route as never)}
              activeOpacity={0.7}
            >
              <IconComponent size={24} color={isActive ? "#A9DC4D" : "#9e9e9e"} />
              <Text style={[styles.menuText, isActive && styles.activeText]}>{item.name}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    borderTopWidth: 1,
    borderTopColor: "#333333",
    paddingBottom: 8,
    paddingTop: 12,
  },
  menuContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 12,
    marginTop: 4,
    color: "#9e9e9e",
  },
  activeText: {
    color: "#A9DC4D",
  },
})

export default BottomMenu