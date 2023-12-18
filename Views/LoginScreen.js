import React, {useState, useEffect, useContext} from "react";
import { StyleSheet, Image, View, Text, Pressable, Alert } from "react-native";
import * as Yup from "yup";
import { auth, USERS, onSnapshot, doc, firestore } from "../Firebase/Config";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../Helpers/AuthContext";

//Käytetää yup kirjastoa määrittelemään ehtoja inputeille
const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Sähköposti"),
    password: Yup.string().required().min(4).label("Salasana"),
  });

  function LoginScreen(props) {
    const {signIn} = useContext(AuthContext);
    const {signOuts} = useContext(AuthContext);
    const {isBroker} = useContext(AuthContext);
    const {isAdmin} = useContext(AuthContext);
    const {logOffBroker} = useContext(AuthContext);
    const {logOffAdmin} = useContext(AuthContext);
    const storeUserData = async (value) => {
      try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('user', jsonValue);
      }
      catch (e){
        console.log("Error in signin:" + e)
      }
    }

    const account = async(user)=>{
      try {
        const unsub = onSnapshot(doc(firestore, USERS, user.uid), (doc)=>{
          //console.log("yritetään",doc.data())
          let rooli = "";
          if (doc.data() && doc.data().type){
            rooli = doc.data().type;
          }
            if(rooli){
              if(rooli == "admin"){
                console.log("admin " + rooli);
                isAdmin();
              }else{
                isBroker();
                console.log("broker " + rooli);
              }
            }else{
              console.log("ei kumpikaan " + rooli);
              logOffAdmin();
              logOffBroker();
            }
          });
      return unsub;
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        AsyncStorage.removeItem('user');
      });
      return () => unsubscribe();
    }, [auth]);

  
  
  
    function handleSubmit(values){
      console.log("sposti",values);
      console.log("käyttäjä",auth);
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
  
          const user = userCredential.user;
          console.log("autentikointi", auth);
          console.log("login succeeded");
          console.log("käyttelijä", user);
          storeUserData(user);
          account(user);
          signIn();
          //setAuthenticated(true);
          //console.log(user);
        })
        .catch((error) => {
          console.log("Login FAIL on user");
          Alert.alert('Tarkista käyttäjänimi ja salasana')
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage, errorCode)
        });
    }
  

    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/user-login-305.png")} />
  
        <AppForm
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Sähköposti"
            textContentType="emailAddress"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="password"
            placeholder="Salasana"
            secureTextEntry
            textContentType="password"
          />
          <SubmitButton title="Kirjaudu sisään" />
        </AppForm>
        <Text style={styles.rText}>Puuttuuko vielä käyttäjä?</Text>
        <Pressable 
            title="rekisteröidy" style={styles.rButton}  
            onPress={() => props.navigation.navigate('Register')}
          >
          <Text style={styles.rButtonText}>Rekisteröidy</Text>
        </Pressable>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      padding: 10,
      paddingTop: 40
    },
    logo: {
      width: 80,
      height: 80,
      alignSelf: "center",
      marginTop: 50,
      marginBottom: 20,
    }, 
    rButton: {
      backgroundColor: 'gray',
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15,
      width: '100%',
      marginVertical: 10
  }, rButtonText: {
    color: 'white',
    fontSize: 18,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  }, 
  rText: {
    marginTop: 20,
    fontSize: 15,
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Avenir',
    color: '#0c0c0c'
}
  });
  
  export default LoginScreen;
  