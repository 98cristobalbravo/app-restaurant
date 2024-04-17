// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import Registro from './screens/Registro';
import AdminScreen from './screens/AdminScreen'; 
import GarzonScreen from './screens/GarzonScreen'
import MesaScreen from './screens/MesaScreen'
import CrearMenuScreen from './screens/CrearMenuScreen'
import VerMenuScreen from './screens/VerMenuScreen'

import firebase from './config/firebase';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ title: 'Inicio de Sesión' }} />
        <Stack.Screen name="Registro" component={Registro} options={{ title: 'Registro' }} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} options={{ title: 'Administrador' }} />
        <Stack.Screen name="GarzonScreen" component={GarzonScreen} options={{ title: 'Pantalla de Garzón'}} />
        <Stack.Screen name="MesaScreen" component={MesaScreen} options={{ title: 'Pantalla Mesa'}} /> 
        <Stack.Screen name="CrearMenuScreen" component={CrearMenuScreen} options={{ title: ''}} /> 
        <Stack.Screen name="VerMenuScreen" component={VerMenuScreen} options={{ title: 'VerMenuScreen'}} /> 
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}
