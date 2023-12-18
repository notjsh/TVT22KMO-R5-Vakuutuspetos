import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Screen from '../components/Screen';

function ListingDetailsScreen({ route }) {
  
const listing = route.params;
const [imageUrl, setImageUrl]= useState();
const storage = getStorage();
const userRef = ref(storage, "users");
const filename = listing.picture ? ref(userRef, listing.picture) : null;
const filePath = filename ? filename.fullPath : null;

if (filePath) {
  getDownloadURL(ref(storage, filePath))
    .then((url) => {
      setImageUrl(url);
    })
    .catch((error) => {
      console.error(error);
    });
}
    return (
        <Screen>
{imageUrl ? (
   <Image style={styles.image} source={{uri: imageUrl}}/>
) : (
  <Image style={styles.image} source={require('../assets/noimage.jpg')} />
)}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.desc}>{listing.description}</Text>
          <Text style={styles.price}>{"Korvaus pyyntö: " + listing.price + "€"}</Text>
          <Text style={styles.price}>{"Tila: " + listing.state}</Text>
        </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    detailsContainer: {
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: '500'
    },
    desc: {
         marginTop: 10,
         fontSize: 15,
    },
    image: {
        width: '100%',
        height: 300
    },
    price: {
     color: '#000',
     fontSize: 20,
     marginVertical: 10
    }
})

export default ListingDetailsScreen;