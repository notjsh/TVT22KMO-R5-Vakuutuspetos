import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Button, Text } from "react-native";
import { collection, getDocs, query, where } from 'firebase/firestore';
//import { firestore } from 'firebase/firestore';
import {firestore} from '../Firebase/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [ilmoitukset, setIlmoitukset] = useState([]);
  const [userData, setUserData] = useState(null); // New state for user data
  const [userDataLoaded, setUserDataLoaded] = useState(false); // New state to track if user data has been loaded
  const [ilmoitusDataLoaded, setIlmoitusDataLoaded] = useState(false); // New state to track if user data has been loaded

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user');
        if (jsonValue !== null) {
          const parsedUser = JSON.parse(jsonValue);
          setUserData(parsedUser);
          setUserDataLoaded(true); // Mark user data as loaded
        }
      } catch (error) {
        console.log("Error in homescreen AsyncStorage read: " + error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userDataLoaded) {
      // Only fetch data if user data has been loaded
      const fetchIlmoitukset = async () => {
        const q = query(
          collection(firestore, 'ilmoitukset'),
          where('userUID', '==', userData.uid)
        );

        const querySnapshot = await getDocs(q);
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        setIlmoitukset(documents);
        setIlmoitusDataLoaded(true);
      };

      fetchIlmoitukset();
    }
  }, [userData, userDataLoaded]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: 'steelblue'
      }
    });
  }, [navigation]);

  if (!ilmoitusDataLoaded) {
    return <View>
            <Text>Welcome, {userData.email}!</Text>
            <Text>Loading...</Text>
        </View>;
  }else{
    return (
        <View>
            <Text>Welcome, {userData.email}!</Text>
            {ilmoitukset.map((ilmoitus) => (
                <Button
                key={ilmoitus.id}
                title={ilmoitus.data.topic}
                onPress={() => {
                    // Handle button press for the specific ilmoitus
                    console.log(`Button pressed for ilmoitus with ID ${ilmoitus.id}`);
                }}
                />
            ))}
        </View>
    );
  }

}