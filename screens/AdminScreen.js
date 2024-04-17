import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { getDatabase, ref, onValue, push, remove } from 'firebase/database';
import firebase from '../config/firebase';

const AdminScreen = ({ navigation }) => {
  const [nuevaCategoriaInput, setNuevaCategoriaInput] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const handleGoToRegister = () => {
    navigation.navigate('Registro');
  };

  const handleGoToCrearMenu = () => {
    navigation.navigate('CrearMenuScreen');
  };

  const handleGoToVerMenu = () =>{
    navigation.navigate('VerMenuScreen');
  };

  const handleAgregarCategoria = () => {
    if (!nuevaCategoriaInput) {
      setErrorMessage('Por favor ingresa una nueva categoría.');
      return;
    }

    const categoriaNormalizada = nuevaCategoriaInput.trim().charAt(0).toUpperCase() + nuevaCategoriaInput.slice(1).toLowerCase();

    if (categorias.find(categoria => categoria.nombre === categoriaNormalizada)) {
      setErrorMessage('La categoría ya existe.');
      return;
    }

    const db = getDatabase(firebase);
    const categoriasRef = ref(db, 'categorias');

    const nuevaCategoriaObj = {
      nombre_categoria: categoriaNormalizada
    };

    push(categoriasRef, nuevaCategoriaObj)
      .then(() => {
        setNuevaCategoriaInput('');
        setErrorMessage(null);
      })
      .catch((error) => {
        setErrorMessage('Error al agregar la nueva categoría: ' + error.message);
      });
  };

  const handleEliminarCategoria = (nombre) => {
    Alert.alert(
      'Eliminar Categoría',
      `¿Estás seguro de que deseas eliminar la categoría "${nombre}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          onPress: () => {
            const db = getDatabase(firebase);
            const categoriasRef = ref(db, 'categorias');
            const categoriaAEliminar = categorias.find(categoria => categoria.nombre === nombre);
            if (!categoriaAEliminar) {
              setErrorMessage('No se encontró la categoría a eliminar.');
              return;
            }
            const { id } = categoriaAEliminar;
            const categoriaRef = ref(db, `categorias/${id}`);
            remove(categoriaRef)
              .then(() => {
                const updatedCategorias = categorias.filter(categoria => categoria.id !== id);
                setCategorias(updatedCategorias);
                setErrorMessage(null);
              })
              .catch((error) => {
                setErrorMessage('Error al eliminar la categoría: ' + error.message);
              });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Funciones</Text>
      <TouchableOpacity onPress={handleGoToRegister} style={styles.button}>
        <Text style={styles.buttonText}>Registrar nuevo usuario</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleGoToCrearMenu} style={styles.button}>
        <Text style={styles.buttonText}>Agregar Menú</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleGoToVerMenu} style={styles.button}>
        <Text style={styles.buttonText}>Ver Menú</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Agregar categoría a menú</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa categoría Ej: Postres"
        onChangeText={text => setNuevaCategoriaInput(text)}
        value={nuevaCategoriaInput}
      />
      <TouchableOpacity onPress={handleAgregarCategoria} style={styles.button}>
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>

      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      
      <Text style={styles.subtitle}>Categorías de menú</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.categoriesContainer}>
          {categorias.map(categoria => (
            <TouchableOpacity
              key={categoria.id}
              style={styles.categoryButton}
              onPress={() => handleEliminarCategoria(categoria.nombre)}
              onLongPress={() => handleEliminarCategoria(categoria.nombre)}
            >
              <Text style={styles.categoryButtonText}>{categoria.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    width: '100%',
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
    textAlign: 'left',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  categoryButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: 'purple',
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    maxHeight: 250,
    width: '100%',
  },
});

export default AdminScreen;
