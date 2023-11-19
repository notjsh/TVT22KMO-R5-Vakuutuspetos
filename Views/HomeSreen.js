import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Button, Text } from "react-native";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [ilmoitukset, setIlmoitukset] = useState([]);

  const getUserData = async () => {
    try {
      const jsonvalue = await AsyncStorage.getItem('user');
      return jsonvalue != null ? JSON.parse(jsonvalue) : null;
    } catch (e) {
      console.log("error in homescreen localstorage read: " + e);
    }
  };
 const user = getUserData();
 

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(firestore, 'ilmoitukset'),
        where('userUID', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      setIlmoitukset(documents);
    };

    fetchData();
  }, [user]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: 'steelblue'
      }
    });
  }, [navigation]);
console.log(user);
  return (
    <View>
      <Text>Welcome, {user.email}!</Text>
      {ilmoitukset.map((ilmoitus) => (
        <Button
          key={ilmoitus.id}
          title={ilmoitus.data.title} // Change 'title' to the actual field name in your ilmoitus data
          onPress={() => {
            // Handle button press for the specific ilmoitus
            console.log(`Button pressed for ilmoitus with ID ${ilmoitus.id}`);
          }}
        />
      ))}
    </View>
  );
}