import React, {useLayoutEffect, useState, useEffect} from "react";
import { StyleSheet, Alert, ActivityIndicator, Pressable, Text, View} from "react-native";
import {
    AppForm as Form,
    AppFormField as FormField,
    AppFormPicker as Picker,
    SubmitButton,
  } from "../components/forms";
  import Screen from "../components/Screen";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { collection, firestore, query, addDoc, getDoc, serverTimestamp, onSnapshot, doc, USERS } from "../Firebase/Config";
  import * as Yup from "yup";

  const validationSchema = Yup.object().shape({
    title: Yup.string().required().min(1).label("Otsikko"),
    description: Yup.string().label("Kirjoita viesti")
  });

function AnswerCard({ navigation, customer, viesti, setAnswered, setAnswer })  {
 const [isLoading, setIsLoading] = useState(false);

 const [userinfo, setUserinfo] = useState(null)
 const [account, setAccount] = useState([])
 const [userDataLoaded, setUserDataLoaded]=useState(false)

 useEffect(()=>{
    const fetchdata  = async ()=>{
        try{
            const jsonValue = await AsyncStorage.getItem('user')
            const parsedUser = JSON.parse(jsonValue)
            setUserinfo(parsedUser)
            setUserDataLoaded(true)
        } catch(error){
            console.log(error)
        }
    }
    fetchdata()
}, []) 


useEffect(()=>{
    if (userDataLoaded){
        const unsub = onSnapshot(doc(firestore, USERS, userinfo.uid), (doc)=>{
            setAccount(doc.data())
            console.log(account)
        })
        }

}, [userinfo, userDataLoaded])



const sendMessage = async (message, { resetForm } ) => {
  try {
    setIsLoading(true); // Näytä latausindikaattori'
    const load = await AsyncStorage.getItem('user');
    const userinf = JSON.parse(load);
    console.log("user", userinf);
    console.log(customer + viesti)

    if (userDataLoaded) {
      const docRef = collection(firestore, 'users', customer, 'viestit', viesti, 'vastaus');
      console.log("NO TULEEEEKO " + docRef)
      // Lisää dokumentti Firestoreen ja hae sen ID
      const addedDocRef = await addDoc(docRef, {
        created: serverTimestamp(),
        vastaaja: account.name,
        message: message.message,
        title: message.title,
      });

      console.log(addedDocRef)
      setAnswer([{
        created: serverTimestamp(),
        vastaaja: account.name,
        message: message.message,
        title: message.title,
      }])

      // Hae lisätyn dokumentin tiedot käyttämällä dokumentin ID:tä
      const addedDocSnapshot = await getDoc(addedDocRef);

      if (addedDocSnapshot.exists()) {
        Alert.alert('Lähetys onnistui', 'Viesti lähetetty onnistuneesti.');

      } else {
        Alert.alert('Virhe', 'Viestin lähetys epäonnistui');
      }
    }
  } catch (error) {
    console.log("errori tapahtui:", error);
  } finally {
    setIsLoading(false); // Piilota latausindikaattori
  }

  console.log("viesti lähetetty:", message);
  setAnswered(true)
  resetForm();
};
return(
    <View style={styles.card}>
    {/* määritellään aloitusarvot */}
    <Form
      initialValues={{
        title: "",
        message: ""
      }}
      onSubmit={sendMessage}
      validationSchema={validationSchema}
      
    >
      <FormField maxLength={255} name="title" placeholder="Otsikko" />
      <FormField
        maxLength={255}
        multiline
        name="message"
        numberOfLines={3}
        placeholder="Kirjoita viesti"
      />
      <SubmitButton title="Lähetä viesti" color="#96bf44"/>
      {isLoading && <ActivityIndicator size="large" color="steelblue" />}
    </Form>
    </View>
)
}


const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 20,
        elevation: 5, // Lisää korostus Androidille
        shadowColor: '#000', // Lisää varjo iOS:lle
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    detailsContainer: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    typeTitle: {
        color: '#6e6969',
        fontSize: 16,
        marginBottom: 5,
    },
    message: {
        fontSize: 18,
        color: '#444',
        marginBottom: 15,
    },
    created: {
        color: '#888',
        fontSize: 14,
    },
});

export default AnswerCard;