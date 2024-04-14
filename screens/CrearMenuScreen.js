import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getDatabase, ref, push, onValue, set } from 'firebase/database'; // Importa las funciones necesarias de Firebase
import firebase from '../config/firebase'; // Importa la configuración de Firebase
import { Picker } from '@react-native-picker/picker'; // Importa Picker desde @react-native-picker/picker

const CrearMenu = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Obtener categorías de la base de datos al cargar el componente
    const db = getDatabase(firebase);
    const categoriasRef = ref(db, 'categorias');

    onValue(categoriasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const categoriasArray = Object.values(data);
        setCategorias(categoriasArray);
      }
    });
  }, []);

  const handleGuardarMenu = () => {
    // Verifica si se ha seleccionado una categoría
    if (!categoria) {
      setErrorMessage('Por favor selecciona una categoría.');
      return;
    }

    const db = getDatabase(firebase); // Obtiene una referencia a la base de datos de Firebase
    const menuRef = ref(db, 'menu'); // Obtiene una referencia a la ubicación donde se guardarán los menús
    
    // Crea un nuevo objeto de menú con el nombre, precio y categoría ingresados
    const nuevoMenu = {
      nombre: nombre,
      precio: precio,
      categoria: categoria
    };

    // Guarda el nuevo menú en la base de datos
    push(menuRef, nuevoMenu)
      .then(() => {
        // Limpiar los campos y mostrar un mensaje de éxito
        setNombre('');
        setPrecio('');
        setCategoria('');
        setSuccessMessage(`Menú ${nombre} con precio ${precio} agregado exitosamente.`);
        setErrorMessage(null);
      })
      .catch((error) => {
        // Muestra un mensaje de error si falla la operación
        setErrorMessage('Error al guardar el menú: ' + error.message);
        setSuccessMessage(null);
      });
  };

  const handleAgregarCategoria = () => {
    if (!nuevaCategoria) {
      setErrorMessage('Por favor ingresa una nueva categoría.');
      return;
    }

    const db = getDatabase(firebase);
    const categoriasRef = ref(db, 'categorias');
    set(categoriasRef, nuevaCategoria)
      .then(() => {
        setNuevaCategoria('');
        setErrorMessage(null);
      })
      .catch((error) => {
        setErrorMessage('Error al agregar la nueva categoría: ' + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Menú</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del elemento"
        onChangeText={setNombre}
        value={nombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        onChangeText={setPrecio}
        value={precio}
      />
      <TextInput
        style={styles.input}
        placeholder="Nueva categoría"
        onChangeText={setNuevaCategoria}
        value={nuevaCategoria}
      />
      <TouchableOpacity onPress={handleAgregarCategoria} style={styles.button}>
        <Text style={styles.buttonText}>Agregar Categoría</Text>
      </TouchableOpacity>
      <Picker
        selectedValue={categoria}
        onValueChange={(itemValue, itemIndex) => setCategoria(itemValue)}>
        <Picker.Item label="Agregar categoría" value="" />
        {categorias.map(c => (
          <Picker.Item key={c.id} value={c.id} label={c.nombre} />
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

export default CrearMenu;
