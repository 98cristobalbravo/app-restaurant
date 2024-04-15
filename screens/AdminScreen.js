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

    // Escuchar cambios en la base de datos para actualizar la lista de categorías
    onValue(categoriasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const categoriasArray = Object.entries(data).map(([id, categoria]) => ({
          id,
          nombre: categoria.nombre_categoria
        }));
        setCategorias(categoriasArray);
      } else {
        // Si no hay categorías, establecer categorías como un array vacío
        setCategorias([]);
      }
    });

    // Cleanup de la suscripción cuando el componente se desmonte
    return () => {
      setCategorias([]); // Limpiamos la lista de categorías al desmontar el componente
    };
  }, []);

  const handleGoToRegister = () => {
    navigation.navigate('Registro');
  };

  const handleGoToMenu = () => {
    navigation.navigate('CrearMenuScreen');
  };

  const handleAgregarCategoria = () => {
    if (!nuevaCategoriaInput) {
      setErrorMessage('Por favor ingresa una nueva categoría.');
      return;
    }

    // Convertir la primera letra a mayúscula y las siguientes letras a minúscula
    const categoriaNormalizada = nuevaCategoriaInput.trim().charAt(0).toUpperCase() + nuevaCategoriaInput.slice(1).toLowerCase();

    // Verificar si la categoría ya existe en la lista de categorías normalizadas
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
                // Actualizar el estado local eliminando la categoría eliminada
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
      <Text style={styles.title}>Pantalla de Administrador</Text>
      <TouchableOpacity onPress={handleGoToRegister} style={styles.button}>
        <Text style={styles.buttonText}>Registrar nuevo usuario</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleGoToMenu} style={styles.button}>
        <Text style={styles.buttonText}>Agregar Menú</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TextInput
        style={styles.input}
        placeholder="Ingresa categoría"
        onChangeText={text => setNuevaCategoriaInput(text)}
        value={nuevaCategoriaInput}
      />
      <TouchableOpacity onPress={handleAgregarCategoria} style={styles.button}>
        <Text style={styles.buttonText}>Agregar Categoría de Menú</Text>
      </TouchableOpacity>

      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      
      {/* Lista de categorías */}
      <Text style={styles.subtitle}>Categorías existentes:</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  categoryButton: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 5,
  },
  categoryButtonText: {
    fontSize: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    width: '50%',
    marginTop: 20,
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: 350, // Limitar la altura para que el ScrollView sea scrollable
    width: '95%',
  },
});

export default AdminScreen;
