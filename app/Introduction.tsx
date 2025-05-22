"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store"
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native"
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated"
import { ArrowRightCircle, CheckCircle2, Clock, Calendar, Zap } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get("window")

export default function Introduction() {
  const user = useSelector((state: RootState) => state.user)
  const navigation = useNavigation()
  const [currentFeature, setCurrentFeature] = useState(0)

  // Animation values
  const rotation = useSharedValue(0)
  const scale = useSharedValue(1)
  const floatY = useSharedValue(0)

  // Features to showcase
  const features = [
    {
      icon: <CheckCircle2 size={28} color="#A9DC4D" />,
      title: "Organize tarefas",
      description: "Gerencie suas tarefas com facilidade e eficiência",
    },
    {
      icon: <Clock size={28} color="#A9DC4D" />,
      title: "Economize tempo",
      description: "Interface intuitiva para maximizar sua produtividade",
    },
    {
      icon: <Calendar size={28} color="#A9DC4D" />,
      title: "Planeje seu dia",
      description: "Organize sua rotina e nunca perca um compromisso",
    },
    {
      icon: <Zap size={28} color="#A9DC4D" />,
      title: "Aumente o foco",
      description: "Concentre-se no que realmente importa",
    },
  ]

  useEffect(() => {
    if (user.id !== 0) {
      ;(navigation as any).navigate("Home")
    }

    // Start animations
    rotation.value = withRepeat(withTiming(360, { duration: 20000, easing: Easing.linear }), -1, false)

    scale.value = withRepeat(withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true)

    floatY.value = withRepeat(withTiming(10, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true)

    // Cycle through features
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [user])

  // Animated styles
  const rotatingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    }
  })

  const scaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  const floatStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: floatY.value }],
    }
  })

  const gradientStyle = useAnimatedStyle(() => {
    const opacity = interpolate(rotation.value % 360, [0, 180, 360], [0.7, 0.9, 0.7])

    return {
      opacity,
    }
  })

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Background elements */}
      <Animated.View style={[styles.backgroundGradient, gradientStyle]}>
        <LinearGradient
          colors={["rgba(169, 220, 77, 0.2)", "rgba(169, 220, 77, 0)", "rgba(169, 220, 77, 0.1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>

      <Animated.View style={[styles.backgroundCircle, rotatingStyle]} />
      <Animated.View style={[styles.backgroundCircleSmall, rotatingStyle]} />

      {/* Logo section */}
      <Animated.View entering={FadeIn.duration(800)} style={styles.logoContainer}>
        <Animated.View style={[styles.logoWrapper, scaleStyle]}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
        </Animated.View>
        <Animated.Text entering={FadeInDown.duration(800).delay(400)} style={styles.appName}>
          Ordit
        </Animated.Text>
        <Animated.Text entering={FadeInDown.duration(800).delay(600)} style={styles.tagline}>
          Simplicidade e produtividade
        </Animated.Text>
      </Animated.View>

      {/* Features section */}
      <Animated.View entering={FadeIn.duration(1000).delay(800)} style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <Animated.View
            key={index}
            style={[
              styles.featureItem,
              { opacity: currentFeature === index ? 1 : 0, display: currentFeature === index ? "flex" : "none" },
            ]}
            entering={index % 2 === 0 ? FadeInLeft.duration(500) : FadeInRight.duration(500)}
          >
            <View style={styles.featureIconContainer}>{feature.icon}</View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </Animated.View>
        ))}

        <View style={styles.indicators}>
          {features.map((_, index) => (
            <View key={index} style={[styles.indicator, currentFeature === index ? styles.indicatorActive : {}]} />
          ))}
        </View>
      </Animated.View>

      <Animated.Text entering={FadeInDown.duration(800).delay(1200)} style={styles.privacyText}>
        Sem cadastros complicados. Comece em segundos.
      </Animated.Text>

      {/* Button section */}
      <Animated.View entering={FadeInDown.duration(800).delay(1000)} style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => (navigation as any).navigate("Login")}
          style={styles.button}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#A9DC4D", "#8BC34A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Começar agora</Text>
            <ArrowRightCircle size={24} color="#000000" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "space-between",
    paddingVertical: 30,
    paddingHorizontal: 24,
    position: "relative",
    overflow: "hidden",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
  backgroundCircle: {
    position: "absolute",
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    borderWidth: 1,
    borderColor: "rgba(169, 220, 77, 0.1)",
    top: -width * 0.5,
    left: -width * 0.25,
  },
  backgroundCircleSmall: {
    position: "absolute",
    width: width,
    height: width,
    borderRadius: width * 0.5,
    borderWidth: 1,
    borderColor: "rgba(169, 220, 77, 0.15)",
    bottom: -width * 0.3,
    right: -width * 0.3,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "rgba(169, 220, 77, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(169, 220, 77, 0.3)",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 36,
    fontWeight: "700",
    color: "#A9DC4D",
    letterSpacing: 2,
    textShadowColor: "rgba(169, 220, 77, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 16,
    color: "#AAAAAA",
    marginTop: 8,
  },
  featuresContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    marginVertical: "auto",
  },
  featureItem: {
    alignItems: "center",
    position: "absolute",
    width: "100%",
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(169, 220, 77, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(169, 220, 77, 0.3)",
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: "#AAAAAA",
    textAlign: "center",
  },
  indicators: {
    flexDirection: "row",
    position: "absolute",
    bottom: -30,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(169, 220, 77, 0.3)",
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: "#A9DC4D",
    width: 20,
  },
  privacyText: {
    color: "#777777",
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
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
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "700",
  },
})
