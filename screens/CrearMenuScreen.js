import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importamos Picker de @react-native-picker/picker

import { getDatabase, ref, push, onValue } from 'firebase/database';
import firebase from '../config/firebase';

const CrearMenuScreen = () => {
  const [nombrePlato, setNombrePlato] = useState('');
  const [precio, setPrecio] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const db = getDatabase(firebase);
    const categoriasRef = ref(db, 'categorias');

    onValue(categoriasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const categoriasArray = Object.entries(data).map(([id, categoria]) => ({
          id,
          nombre: categoria.nombre_categoria
        }));
        setCategorias(categoriasArray);
      } else {
        setCategorias([]);
      }
    });

    return () => {
      setCategorias([]);
    };
  }, []);

  const handleGuardarMenu = () => {
    if (!nombrePlato || !precio || !selectedCategoria) {
      setErrorMessage('Por favor completa todos los campos.');
      return;
    }

    const db = getDatabase(firebase);
    const menuRef = ref(db, 'menu');

    const nuevoMenu = {
      nombre_comida: nombrePlato,
      precio_comida: precio,
      categoria: selectedCategoria
    };

    push(menuRef, nuevoMenu)
      .then(() => {
        setNombrePlato('');
        setPrecio('');
        setSelectedCategoria('');
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
      <Text style={styles.title}>Agregar plato</Text>
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
      <Picker
        selectedValue={selectedCategoria}
        onValueChange={(itemValue) => setSelectedCategoria(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccionar categoría" value="" />
        {categorias.map((categoria) => (
          <Picker.Item key={categoria.id} label={categoria.nombre} value={categoria.id} />
        ))}
      </Picker>
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
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: '#fff',
    alignItems: 'center', // Alineación al centro
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Alineación al centro
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    width: '80%',
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center', // Alineación al centro
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
    textAlign: 'center', // Alineación al centro
  },
});

export default CrearMenuScreen;