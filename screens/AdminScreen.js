// AdminScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AdminScreen = ({ navigation }) => {
  const handleGoToRegister = () => {
    navigation.navigate('Registro');
  };

  const handleGoToMenu = () => {
    navigation.navigate('CrearMenuScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Administrador</Text>
      <TouchableOpacity onPress={handleGoToRegister} style={styles.button}>
        <Text style={styles.buttonText}>Registrar nuevo usuario</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleGoToMenu} style={styles.button}>
        <Text style={styles.buttonText}>Agregar Menú</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AdminScreen;
