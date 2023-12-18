import React, { useLayoutEffect, useState } from "react";
import { Button, StyleSheet, Image, Alert, ActivityIndicator } from "react-native";
import * as Yup from "yup";

import {
  AppForm as Form,
  AppFormField as FormField,
  AppFormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, firestore, query } from "../Firebase/Config";
import { addDoc, serverTimestamp, getDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

//Käytetää yup kirjastoa määrittelemään ehtoja inputeille
  const validationSchema = Yup.object().shape({
    title: Yup.string().required().min(1).label("Otsikko"),
    category: Yup.object().required().nullable().label("Valitse kategoria"),
    price: Yup.number().required().min(1).max(10000).label("Vahingon arvo"),
    description: Yup.string().label("Kuvaus tapahtuneesta")
  });

  //määritellään halutut kategoriat jotka annetaan propsina valikko komponentille
  const categories = [
    { label: "Autot", value: 1 },
    { label: "Koti ja irtaimisto", value: 2 },
    { label: "Muu omaisuus", value: 3 },
  ];
export default function Lomake({navigation}){
  const [image, setImage] = useState(null);
  const [uuid, setUuid] = useState("");
  const [isLoading, setIsLoading] = useState(false);


    const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let iresult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!iresult.canceled) {
      setImage(iresult.assets[0].uri);
    }
    };
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerStyle:{
                backgroundColor: 'steelblue'
            }
            
        })
    }, [])
    async function uploadImageAsync(uri) {
      // Why are we using XMLHttpRequest? See:
      // https://github.com/expo/expo/issues/2402#issuecomment-443726662
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
    
      const fileRef = ref(getStorage(), "users/"+uuid+"/"+image.substring(image.lastIndexOf('/') + 1, image.length));
      const result = await uploadBytes(fileRef, blob);
    
      // We're done with the blob, close and release it
      blob.close();
    
      return await getDownloadURL(fileRef);
    }
    const addReport = async (reportinfo, { resetForm }) => {
      try {

        setIsLoading(true); // Näytä latausindikaattori
        const load = await AsyncStorage.getItem('user');
        const userinf = JSON.parse(load);
    
        console.log("user", userinf.uid);
        setUuid(userinf.uid);
    
        if (userinf) {
          const docRef = collection(firestore, 'users', userinf.uid, 'ilmoitukset');
    
          // Lisää dokumentti Firestoreen ja hae sen ID
          const addedDocRef = await addDoc(docRef, {
            created: serverTimestamp(),
            tila: "Lähetetty",
            typenumber: reportinfo.category.value,
            typeTitle: reportinfo.category.label,
            description: reportinfo.description,
            damageValue: reportinfo.price,
            title: reportinfo.title,
            picture: image ? image.substring(image.lastIndexOf('/') + 1, image.length) : null,
          });
    
          // Hae lisätyn dokumentin tiedot käyttämällä dokumentin ID:tä
          const addedDocSnapshot = await getDoc(addedDocRef);
    
          // Tarkista, että dokumentti on lisätty onnistuneesti
          if (addedDocSnapshot.exists()) {
            if (image) {
              const uploadUrl = await uploadImageAsync(image);
              setImage(uploadUrl);
            }
            Alert.alert('Lähetys onnistui', 'Lomake lähetetty onnistuneesti.');
            setImage(null)
          } else {
            Alert.alert('Virhe', 'Lomakkeen lähetys epäonnistui');
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false); // Piilota latausindikaattori
      }
      console.log("lomaketiedot", reportinfo);
      resetForm();
    };

    return (

        <Screen>
          {/* määritellään aloitusarvot */}
          <Form
            initialValues={{
              title: "",
              price: "",
              description: "",
              category: null,
              picture: null,
            }}
            onSubmit={addReport}
            validationSchema={validationSchema}
          >
            <FormField maxLength={255} name="title" placeholder="Otsikko" />
            <Picker items={categories} name="category" placeholder="Valitse kategoria" />
            <FormField
              keyboardType="numeric"
              maxLength={8}
              name="price"
              placeholder="Vahingon arvo"
              
            />
            <Button title="Kuva tapahtuneesta" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            <FormField
              maxLength={255}
              multiline
              name="description"
              numberOfLines={3}
              placeholder="Kuvaus tapahtuneesta"
            />
            <SubmitButton title="Lähetä" color="#96bf44"/>
            {isLoading && <ActivityIndicator size="large" color="steelblue" />}
          </Form>
        </Screen>
      );
    }

const styles = StyleSheet.create({
    container: {
      padding: 10,
    },
  });