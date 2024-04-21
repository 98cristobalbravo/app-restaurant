import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import firebase from '../config/firebase';

const CrearMenuScreen = () => {
  const [nombrePlato, setNombrePlato] = useState('');
  const [precio, setPrecio] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [secciones, setSecciones] = useState([]); // Nuevo estado para almacenar las secciones
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedSeccion, setSelectedSeccion] = useState(''); // Nuevo estado para almacenar la sección seleccionada
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const db = getDatabase(firebase);
    const categoriasRef = ref(db, 'categorias');
    const seccionesRef = ref(db, 'secciones'); // Referencia a las secciones en la base de datos

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

    onValue(seccionesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const seccionesArray = Object.entries(data).map(([id, seccion]) => ({
          id,
          nombre: seccion.nombre_seccion
        }));
        setSecciones(seccionesArray);
      } else {
        setSecciones([]);
      }
    });

    return () => {
      setCategorias([]);
      setSecciones([]);
    };
  }, []);

  const handleGuardarMenu = () => {
    if (!nombrePlato || !precio || !selectedCategoria || !selectedSeccion) {
      setErrorMessage('Por favor completa todos los campos.');
      return;
    }

    const db = getDatabase(firebase);
    const menuRef = ref(db, 'menu');

    // Buscar el ID de la categoría seleccionada
    const selectedCategoryId = categorias.find(categoria => categoria.nombre === selectedCategoria)?.id;

    const nuevoMenu = {
      nombre_comida: nombrePlato,
      precio_comida: precio,
      categoria_id: selectedCategoryId, // Guardar el ID de la categoría
      categoria: selectedCategoria, // Guardar el nombre de la categoría
      seccion: selectedSeccion // Guardar el nombre de la sección
    };

    push(menuRef, nuevoMenu)
      .then(() => {
        setNombrePlato('');
        setPrecio('');
        setSelectedCategoria('');
        setSelectedSeccion('');
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
          <Picker.Item key={categoria.id} label={categoria.nombre} value={categoria.nombre} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedSeccion}
        onValueChange={(itemValue) => setSelectedSeccion(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccionar sección" value="" />
        {secciones.map((seccion) => (
          <Picker.Item key={seccion.id} label={seccion.nombre} value={seccion.nombre} />
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
    backgroundColor: 'white', // Light gray background
    alignItems: 'center',
  },
  title: {
    fontSize: 30, // Increased title font size
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333', // Darker gray text for better contrast
  },
  input: {
    width: '100%', // Use full width for inputs
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff', // White input background
  },
  picker: {
    width: '100%', // Use full width for picker
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff', // White picker background
  },
  button: {
    width: '100%', // Use full width for button
    backgroundColor: '#28a745', // Green button color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#ccc', // Light gray shadow
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff', // White text on button
    fontWeight: 'bold',
    fontSize: 17,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default CrearMenuScreen;
