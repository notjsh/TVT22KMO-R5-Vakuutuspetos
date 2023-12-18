import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

function Card({ title, typeTitle, message, created, sender, email }) {
    return (
        <View style={styles.card}>
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
                {typeTitle && <Text style={styles.typeTitle}>{typeTitle}</Text>}
                {sender && <Text style={styles.typeTitle}>{sender}</Text>}
               {email && <Text style={styles.typeTitle}>{email}</Text>}
                <Text style={styles.created}>{created}</Text>
            </View>
        </View>
    );
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
        marginVertical: 5
    },
    message: {
        fontSize: 18,
        color: '#444',
        marginBottom: 15,
    },
    created: {
        color: '#888',
        fontSize: 14,
        marginTop: 5
    },
});

export default Card;