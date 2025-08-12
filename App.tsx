import React from 'react';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
import { enableScreens } from 'react-native-screens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './store';
import { StatusBar } from 'expo-status-bar';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';

if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

// Screens
import IntroductionScreen from 'app/Introduction';
import RegisterScreen from 'app/Register';
import LoginScreen from 'app/Login';
import HomeScreen from 'app/Home';
import CalendarScreen from 'app/Calendar';
import SettingsScreen from 'app/Settings';

export default function App() {
  enableScreens();
  const Stack = createStackNavigator();

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <MenuProvider>
          <NavigationContainer>
            <SafeAreaView style={{ flex: 1 }}>
              <Stack.Navigator initialRouteName="Introduction" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Introduction" component={IntroductionScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ animation: 'none' }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'none' }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ animation: 'none' }} />
                <Stack.Screen name="Calendar" component={CalendarScreen} options={{ animation: 'none' }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: 'none' }} />
              </Stack.Navigator>
            </SafeAreaView>
          </NavigationContainer>
          <StatusBar style="auto" />
        </MenuProvider>
      </Provider>
    </SafeAreaProvider>
  );
}