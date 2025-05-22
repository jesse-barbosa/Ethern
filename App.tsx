import React from 'react';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
import { enableScreens } from 'react-native-screens';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './store';
import { StatusBar } from 'expo-status-bar';
import { MenuProvider } from 'react-native-popup-menu';

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
    <Provider store={store}>
      <MenuProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Introduction">
            <Stack.Screen name="Introduction" component={IntroductionScreen} options={{ headerShown: false, }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name="Calendar" component={CalendarScreen} options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false, animation: 'none' }} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </MenuProvider>
    </Provider>
  );
}