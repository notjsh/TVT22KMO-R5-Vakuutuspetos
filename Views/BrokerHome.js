import React from "react";
import { useLayoutEffect, useState, useEffect } from "react";
import { Text, FlatList, StyleSheet, View } from "react-native";
import {collection, doc, USERS, where, firestore, query, getDocs, onSnapshot, orderBy} from '../Firebase/Config'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Screen from "../components/Screen";
import ListItem from "../components/ListItem";
import ListItemSeparator from "../components/ListItemSeparator";
import { convertFirebaseTimeStampToJS } from "../Helpers/Timestamp";
import Icon from "../components/Icon";

export default function BrokerHome({navigation}){
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerStyle:{
                backgroundColor: 'steelblue'
            }
            
        })
    }, [])

const [userDataLoaded, setUserDataLoaded] = useState(false);
const [ilmoitusDataLoaded, setIlmoitusDataLoaded] = useState(false);
const [userData, setUserData] = useState(null);
const [role, setRole] = useState("");
const [cars, setCars] = useState(false);
const [property, setProperty] = useState(false);
const [other, setOther] = useState(false);
const [sent, setSent]= useState([])
const [ilmoitukset, setIlmoitukset]= useState([])
const [ilmoituksetLoated, setIlmoituksetLoated] = useState(false);
const [refreshing, setRefreshing] = useState(false)


useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user');
          const parsedUser = JSON.parse(jsonValue);
          setUserData(parsedUser);
          setUserDataLoaded(true); // Mark user data as loaded
          console.log("userdataloaded" + userDataLoaded)
      } catch (error) {
        console.log("Error in homescreen AsyncStorage read: " + error);
      }
    };
    fetchData();
}, []);


useEffect(()=>{
    if (userDataLoaded){
        const unsub = onSnapshot(doc(firestore, USERS, userData.uid), (doc)=>{
            if(doc.data().type === "Auto"){
                setRole("Autot")
            }
            else if(doc.data().type === "Koti ja irtaimisto"){
                setRole("Koti ja irtaimisto")
            }
            else{
                setRole("Muu omaisuus")
            }
            
        })
        console.log("rooli nyt" + role)
        }
        

}, [userData, userDataLoaded])


useEffect(()=>{
    if (userDataLoaded){
        const q = query(collection(firestore, USERS))
    
        const unsubscribe = onSnapshot(q,(querySnapshot)=>{
            const tempSent = []

            querySnapshot.forEach((doc)=>{
                const sentObject={
                    id: doc.id,
                    title: doc.data().name,
                    description: doc.data().email,
                }
                tempSent.push(sentObject)
            })
            console.log(tempSent)
                setSent(tempSent)
               setIlmoitusDataLoaded(true)
            })
            return () =>{
                unsubscribe()
            }
        }

}, [role, userDataLoaded])

useEffect(() => {
    if (userDataLoaded) {
       getIlmoitukset();
    }
  }, [userDataLoaded, sent]);

  const getIlmoitukset = () => {
    const tempIlmoitukset = [];
  
    const fetchData = async () => {
      const promises = sent.map(async (user) => {
        const ilmoitusRef = collection(firestore, USERS, user.id, "ilmoitukset")
        const ilmoitusQuery = query(ilmoitusRef, where("typeTitle", "==", role), orderBy('created', 'desc'));
        const ilmoitusSnapshot = await getDocs(ilmoitusQuery);

        ilmoitusSnapshot.forEach((doc) => {
          const ilmoitusObject = {
            userId: user.id,
            id: doc.id,
            created: convertFirebaseTimeStampToJS(doc.data().created),
            state: doc.data().tila,
            title: doc.data().title,
            price: doc.data().damageValue,
            description: doc.data().description,
            picture: doc.data().picture,
            sender: user.title,
            email: user.description,
            type: doc.data().typeTitle
          };
          tempIlmoitukset.push(ilmoitusObject);
        });
      });

      await Promise.all(promises);

      console.log(tempIlmoitukset)
      setIlmoitukset(tempIlmoitukset);
      setIlmoituksetLoated(true);
    };

    fetchData();
  }

  
  if(!ilmoituksetLoated){
    return <Screen><Text>Loading..</Text></Screen>}
    else{
  return (
        <View style={styles.container}>
        <Text style={styles.text}>Asiakkaiden lähettämät ilmoitukset sekä niiden tilat.</Text>
        <FlatList 
        data={ilmoitukset}
        keyExtractor={message => message.id.toString()}
        renderItem={({item}) => 
        <ListItem
        title={item.title}
        subTitle={item.description}
        sended={item.created}
        state={item.state}
        IconComponent={
            <Icon 
            name= "email"
            backgroundColor="gray"
            />
        }
        onPress={() => navigation.navigate("listingdetails", item)}
        />
        }
        ItemSeparatorComponent={ListItemSeparator}
        refreshing={refreshing}
        onRefresh={() => getIlmoitukset()}
        />
        </View>
    ) }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingBottom: 10
      
    },
    clickable:{
        backgroundColor: 'white',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: "center"

    },
    title: {
        textDecorationColor: 'salmon'
    },
    text: {
        margin: 20,
        fontSize: 15,
        textAlign: 'center',
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Avenir',
        color: '#0c0c0c'
    }
  });