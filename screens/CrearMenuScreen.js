import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { getDatabase, ref, push } from 'firebase/database';
import firebase from '../config/firebase';

const CrearMenuScreen = () => {
  const [nombrePlato, setNombrePlato] = useState('');
  const [precio, setPrecio] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleGuardarMenu = () => {
    if (!nombrePlato || !precio) {
      setErrorMessage('Por favor completa todos los campos.');
      return;
    }

    const db = getDatabase(firebase);
    const menuRef = ref(db, 'menu');

    const nuevoMenu = {
      nombre_comida: nombrePlato,
      precio_comida: precio
    };

    push(menuRef, nuevoMenu)
      .then(() => {
        setNombrePlato('');
        setPrecio('');
        setSuccessMessage(`Menú "${nombrePlato}" con precio "${precio}" agregado exitosamente.`);
        setErrorMessage(null);
      })
      .catch((error) => {
        setErrorMessage('Error al guardar el menú: ' + error.message);
        setSuccessMessage(null);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Menú</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del plato"
        onChangeText={setNombrePlato}
        value={nombrePlato}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        onChangeText={setPrecio}
        value={precio}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={handleGuardarMenu} style={styles.button}>
        <Text style={styles.buttonText}>Guardar Menú</Text>
      </TouchableOpacity>
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
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
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
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
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
  },
});

export default CrearMenuScreen;
