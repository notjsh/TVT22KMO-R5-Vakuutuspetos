import React from "react";
import { useLayoutEffect, useState, useEffect } from "react";
import { Text, FlatList, StyleSheet, View, Modal, Button } from "react-native";
import {collection, doc, USERS, where, firestore, query, getDocs, onSnapshot, orderBy} from '../Firebase/Config'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Screen from "../components/Screen";
import ListItem from "../components/ListItem";
import ListItemSeparator from "../components/ListItemSeparator";
import { convertFirebaseTimeStampToJS } from "../Helpers/Timestamp";
import Icon from "../components/Icon";
import Card from "../components/Card";
import AnswerCard from "../components/AnswerCard";

export default function BrokerMessages({navigation}){
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
const [modalVisible, setModalVisible] = useState(false) 
const [selectedMessage, setSelectedMessage] = useState('') 
const [answered, setAnswered] = useState(false) 
const [answer, setAnswer] = useState([]) 


useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user');
          const parsedUser = JSON.parse(jsonValue);
          setUserData(parsedUser);
          setUserDataLoaded(true); // Mark user data as loaded
      } catch (error) {
        console.log("Error in homescreen AsyncStorage read: " + error);
      }
    };
    fetchData();
}, []);



useEffect(()=>{
    if (userDataLoaded){
        const unsub = onSnapshot(doc(firestore, USERS, userData.uid), (doc)=>{
            setRole(doc.data().type)
            console.log(doc.data().type)
            console.log("rooli",role)
            
        })
        }

}, [userData, userDataLoaded])



/*if(role === "Auto"){
setCars(true)
}
else if(role === "Omaisuus"){
    setProperty(true)
}
else{
    setOther(true)
}*/
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
        const ilmoitusQuery = query(collection(firestore, USERS, user.id, "viestit"), orderBy('created', 'desc'));
        const ilmoitusSnapshot = await getDocs(ilmoitusQuery);

        ilmoitusSnapshot.forEach((doc) => {
          const ilmoitusObject = {
            userId: user.id,
            id: doc.id,
            created: convertFirebaseTimeStampToJS(doc.data().created),
            title: doc.data().title,
            message: doc.data().message,
            typeTitle: doc.data().typeTitle,
            sender: user.title,
            email: user.description,
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
    <Screen>
    <FlatList 
    data={ilmoitukset}
    keyExtractor={message => message.id.toString()}
    renderItem={({item}) => 
    <ListItem
    title={item.title}
    subTitle={item.message}
    sended={item.created}
    type={item.typeTitle}
    IconComponent={
        <Icon 
        name= "email"
        backgroundColor="gray"
        />
    }
    onPress={() => {
        setModalVisible(true)
        setSelectedMessage(item)
    }}
    />
    }
    ItemSeparatorComponent={ListItemSeparator}
  /*   refreshing={refreshing}
    onRefresh={() => } */
    />
<Modal visible={modalVisible} animationType='slide'>
    <Screen>
    <Button title="sulje" onPress={() => setModalVisible(false)}/>
    <Card 
    title={selectedMessage.title}
    message={selectedMessage.message} 
    typeTitle={selectedMessage.typeTitle}
    created={selectedMessage.created}
    sender={selectedMessage.sender}
    email={selectedMessage.email}
    />
  <Card 
    title={answer[0].title}
    message={answer[0].message} 
    created={answer[0].created}
    sender={answer[0].vastaaja}
  />
    <AnswerCard customer={selectedMessage.userId} viesti={selectedMessage.id} setAnswered={setAnswered} setAnswer={setAnswer}/>
    </Screen>
</Modal>
    </Screen>
    ) }

/* return(
    <Screen>
        <Text>Olet meklari.</Text>
    <FlatList 
    data={sent}
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
    />
    </Screen>
) */
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