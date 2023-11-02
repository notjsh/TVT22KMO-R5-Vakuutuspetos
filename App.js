import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Firestore } from 'firebase/firestore';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {AntDesign} from '@expo/vector-icons'
import HomeScreen from './Views/HomeScreen';
import Lomake from './Views/Lomake';
import Account from './Views/Account';
import Contact from './Views/ContactInfo';

export default function App() {

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Home'
      screenOptions={{
        tabBarActiveTintColor: 'palevioletred',
      }}>
        <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerTitle: 'Home',
          tabBarIcon: ({color,size})=>(
            <AntDesign name="home" size={size} color="steelblue"></AntDesign>
          )
        }}></Tab.Screen>
        <Tab.Screen
        name="lomake"
        component={Lomake}
        options={{
          title: 'Lomake',
          headerTitle: 'Lähetä vahinkoilmoituslomake',
          tabBarIcon: ({color,size})=>(
            <AntDesign name="plus" size={size} color="steelblue"></AntDesign>
          )
        }}></Tab.Screen>
        <Tab.Screen
        name="account"
        component={Account}
        options={{
          title: 'Käyttäjä',
          headerTitle: 'Käyttäjäasetukset',
          tabBarIcon: ({color,size})=>(
            <AntDesign name="user" size={size} color="steelblue"></AntDesign>
          )
        }}></Tab.Screen>
        <Tab.Screen
        name="contact"
        component={Contact}
        options={{
          title: 'Viesti',
          headerTitle: 'Lähetä viesti',
          tabBarIcon: ({color,size})=>(
            <AntDesign name="mail" size={size} color="steelblue"></AntDesign>
          )
        }}></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
