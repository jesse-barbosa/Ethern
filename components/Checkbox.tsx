"use client"

import React from "react"
import { TouchableOpacity, StyleSheet } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from "react-native-reanimated"
import { Check } from "lucide-react-native"

interface CheckboxProps {
  checked: boolean
  onToggle: () => void
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onToggle }) => {
  const progress = useSharedValue(checked ? 1 : 0)

  React.useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: 200 })
  }, [checked])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(progress.value, [0, 1], ["transparent", "#A9DC4D"]),
      borderColor: interpolateColor(progress.value, [0, 1], ["#666666", "#A9DC4D"]),
    }
  })

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
      <Animated.View style={[styles.checkbox, animatedStyle]}>
        {checked && <Check size={16} color="#000000" />}
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default Checkbox
