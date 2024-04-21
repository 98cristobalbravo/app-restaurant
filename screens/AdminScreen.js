import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { getDatabase, ref, onValue, push, remove } from 'firebase/database';
import firebase from '../config/firebase';

const AdminScreen = ({ navigation }) => {
  const [nuevaCategoriaInput, setNuevaCategoriaInput] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [nuevaSeccionInput, setNuevaSeccionInput] = useState('');
  const [secciones, setSecciones] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const db = getDatabase(firebase);
    const categoriasRef = ref(db, 'categorias');
    const seccionesRef = ref(db, 'secciones');

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

  const handleGoToRegister = () => {
    navigation.navigate('Registro');
  };

  const handleGoToCrearMenu = () => {
    navigation.navigate('CrearMenuScreen');
  };

  const handleGoToVerMenu = () => {
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

  const handleAgregarSeccion = () => {
    if (!nuevaSeccionInput) {
      setErrorMessage('Por favor ingresa una nueva sección.');
      return;
    }

    const seccionNormalizada = nuevaSeccionInput.trim().charAt(0).toUpperCase() + nuevaSeccionInput.slice(1).toLowerCase();

    if (secciones.find(seccion => seccion.nombre === seccionNormalizada)) {
      setErrorMessage('La sección ya existe.');
      return;
    }

    const db = getDatabase(firebase);
    const seccionesRef = ref(db, 'secciones');

    const nuevaSeccionObj = {
      nombre_seccion: seccionNormalizada
    };

    push(seccionesRef, nuevaSeccionObj)
      .then(() => {
        setNuevaSeccionInput('');
        setErrorMessage(null);
      })
      .catch((error) => {
        setErrorMessage('Error al agregar la nueva sección: ' + error.message);
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

  const handleEliminarSeccion = (nombre) => {
    Alert.alert(
      'Eliminar Sección',
      `¿Estás seguro de que deseas eliminar la sección "${nombre}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          onPress: () => {
            const db = getDatabase(firebase);
            const seccionesRef = ref(db, 'secciones');
            const seccionAEliminar = secciones.find(seccion => seccion.nombre === nombre);
            if (!seccionAEliminar) {
              setErrorMessage('No se encontró la sección a eliminar.');
              return;
            }
            const { id } = seccionAEliminar;
            const seccionRef = ref(db, `secciones/${id}`);
            remove(seccionRef)
              .then(() => {
                const updatedSecciones = secciones.filter(seccion => seccion.id !== id);
                setSecciones(updatedSecciones);
                setErrorMessage(null);
              })
              .catch((error) => {
                setErrorMessage('Error al eliminar la sección: ' + error.message);
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
        <Text style={styles.buttonText}>Agregar Categoría</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Categorías</Text>
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
      <Text style={styles.subtitle}>Agregar sección a menú</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa sección Ej: Cocina"
        onChangeText={text => setNuevaSeccionInput(text)}
        value={nuevaSeccionInput}
      />
      <TouchableOpacity onPress={handleAgregarSeccion} style={styles.button}>
        <Text style={styles.buttonText}>Agregar Sección</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Secciones</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.categoriesContainer}>
          {secciones.map(seccion => (
            <TouchableOpacity
              key={seccion.id}
              style={styles.categoryButton}
              onPress={() => handleEliminarSeccion(seccion.nombre)}
              onLongPress={() => handleEliminarSeccion(seccion.nombre)}
            >
              <Text style={styles.categoryButtonText}>{seccion.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  button: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'center',
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  categoryButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollView: {
    maxHeight: 150,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default AdminScreen;
