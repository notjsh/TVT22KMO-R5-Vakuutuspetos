import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import {auth} from './Firebase/Config';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {AntDesign} from '@expo/vector-icons';
//import LoginScreen from './Views/LoginScreen';
import HomeScreen from './Views/HomeSreen';
import Lomake from './Views/Lomake';
import Account from './Views/Account';
import Contact from './Views/ContactInfo';
import LoginScreen from './Views/LoginScreen';
import RegisterScreen from './Views/RegisterScreen';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const storeUserData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('user', jsonValue);
    }
    catch (e){
      console.log("Error in signin:" + e)
    }
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      AsyncStorage.removeItem('user');
      setAuthenticated(false);
    });
    return () => unsubscribe();
  }, [auth]);

  function handleSubmit(event, email, password){
    event.preventDefault();
    console.log(email);
    console.log(password);
    console.log(auth);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {

        const user = userCredential.user;
        console.log(auth);
        console.log("login succeeded");
        console.log(user);
        storeUserData(user);

        setAuthenticated(true);
        //console.log(user);
      })
      .catch((error) => {
        console.log("Login FAIL on user");
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  const Tab = createBottomTabNavigator();

  return <RegisterScreen />

/*   return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Home'
  if(authenticated){
    return (
      <NavigationContainer>
      <Tab.Navigator initialRouteName='home'
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
  ); */
    );
  } else{
    return(
      <View style={styles.container}>
        <TextInput
          type="email"
          value={email}
          placeholder="Email..."
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          type="password"
          value={password}
          placeholder="Password..."
          onChangeText={(text) => setPassword(text)}
        />
        <Button title="Submit" onPress={(e) => handleSubmit(e, email, password)} />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
  login:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
