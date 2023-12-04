import React from "react";
import { useLayoutEffect, useContext, useState} from "react";
import Screen from "../components/Screen";
import { FlatList, Alert } from "react-native";
import AccountInfoItem from "../components/AccountInfoItem";
import Icon from "../components/Icon";
import ListItemSeparator from "../components/ListItemSeparator";
import { signOut, deleteUser } from "firebase/auth";
import {deleteDoc, doc} from 'firebase/firestore';
import {auth, firestore} from "../Firebase/Config"
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./LoginScreen";
import { StackActions } from "@react-navigation/native";
import AuthContext from "../Helpers/AuthContext";
import ReauthModal from "./ReauthModal";

export default function Account({navigation}){
    const {signOuts} = useContext(AuthContext);
    const [isReauthDialogVisible, setReauthDialogVisible] = useState(false);


    function showReauthDialog() {
        setReauthDialogVisible(true);
    }

    function hideReauthDialog(){
        setReauthDialogVisible(false);
    }

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerStyle:{
                backgroundColor: 'steelblue'
            }
            
        })
    }, [])
    

    function showConfirmDialog() {
        return Alert.alert(
            "Are you sure?",
            "Do you want to remove your Account?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        showReauthDialog()
                    },
                },
                {
                    text: "No"
                },
            ]
        );
    };

    async function removeAccount(){
        console.log("poisto");
        user = auth.currentUser;
        if(user){
            const userDocRef = doc(firestore, 'users', user.uid);
            try{
                await deleteDoc(userDocRef);
                console.log("User Document Deleted");
            } catch (error){
                console.error("Error deleting user document:", error);
            }
            try {
                await deleteUser(user);
                console.log("user deleted");
                logOut();
            } catch (error){
                console.error("Error deleting user: ", error);
            }
        }
    }

    function logOut(){
        signOut(auth)
        AsyncStorage.removeItem('user')
        .then(()=>{
            signOuts();
        })
        .catch((error)=>{
            console.log("errori:", error)
        })
    }

    return(
        <Screen>
            <AccountInfoItem
            title="Käyttäjätiedot"
            IconComponent={
                <Icon 
                name= "account-details-outline"
                backgroundColor="gray"
                />
            }
            onPress={() => navigation.navigate("accinfo")}
            />
            <ListItemSeparator></ListItemSeparator>
            <AccountInfoItem
            title="Vaihda salasana"
            IconComponent={
                <Icon 
                name= "account-key-outline"
                backgroundColor="gray"
                />
            }
            onPress={() => navigation.navigate("changepassword")}
            />
            <ListItemSeparator></ListItemSeparator>
            <AccountInfoItem
            title="Poista käyttäjätunnus"
            IconComponent={
                <Icon 
                name= "account-remove-outline"
                backgroundColor="gray"
                />
            }
            onPress={() => showConfirmDialog()}
            />
            <ListItemSeparator></ListItemSeparator>
            <AccountInfoItem
            title="Kirjaudu ulos"
            IconComponent={
                <Icon 
                name= "logout"
                backgroundColor="gray"
                />
            }
            onPress={logOut}
            />
            <ReauthModal
                isVisible={isReauthDialogVisible}
                onClose={() => hideReauthDialog()}
                onReauth={removeAccount}
            />
        </Screen>
    )
}