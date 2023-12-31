import react from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import AccountInfo from '../Views/AccountInfo';
import Account from '../Views/Account';
import ChangePassword from '../Views/ChangePassword';
import LoginScreen from '../Views/LoginScreen';
import MessagesScreen from '../Views/MessagesScreen';


const Stack = createStackNavigator();

const AccInfoNavigation = () => (
    <Stack.Navigator>
        <Stack.Screen name="acc" component={Account}   options={{
          title: 'Käyttäjäasetukset',
          headerTitleStyle: { color: 'white' },
        }}/>
        <Stack.Screen name="accinfo" component={AccountInfo}   options={{
          headerTitle: 'Käyttäjätiedot',
          headerTitleStyle: { color: 'white' },
          headerTintColor: 'white'
        }}/>
        <Stack.Screen name="changepassword" component={ChangePassword}   options={{
          headerTitle: 'Vaihda salasana',
          headerTitleStyle: { color: 'white' },
          headerTintColor: 'white',
          headerStyle:{
            backgroundColor: 'steelblue'
          }
        }}/>
        <Stack.Screen name="messages" component={MessagesScreen}   options={{
          headerTitle: 'Viestit',
          headerTitleStyle: { color: 'white' },
          headerTintColor: 'white'
        }}/>
    </Stack.Navigator>
)

export default AccInfoNavigation; 