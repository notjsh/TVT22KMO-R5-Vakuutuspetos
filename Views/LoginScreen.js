import React from "react";
import { StyleSheet, Image, View } from "react-native";
import * as Yup from "yup";

import { AppForm, AppFormField, SubmitButton } from "../components/forms";

//Käytetää yup kirjastoa määrittelemään ehtoja inputeille
const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Sähköposti"),
    password: Yup.string().required().min(4).label("Salasana"),
  });

  function LoginScreen(props) {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/user-login-305.png")} />
  
        <AppForm
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => console.log(values)}
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
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      padding: 10,
      paddingTop: 150
    },
    logo: {
      width: 80,
      height: 80,
      alignSelf: "center",
      marginTop: 50,
      marginBottom: 20,
    },
  });
  
  export default LoginScreen;
  
