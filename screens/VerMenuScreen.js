import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import firebase from '../config/firebase';

const VerMenuScreen = () => {
  const [menu, setMenu] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const db = getDatabase(firebase);
    const menuRef = ref(db, 'menu');
    const categoriasRef = ref(db, 'categorias');

    onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const menuArray = Object.entries(data).map(([id, plato]) => ({ id, ...plato }));
        setMenu(menuArray);
      } else {
        setMenu([]);
      }
    });

    onValue(categoriasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCategorias(data);
      } else {
        setCategorias({});
      }
    });
  }, []);

  const handleEliminarPlato = (id) => {
    Alert.alert(
      'Eliminar Plato',
      '¿Estás seguro de que deseas eliminar este plato?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            const db = getDatabase(firebase);
            const platoRef = ref(db, `menu/${id}`);
            remove(platoRef)
              .then(() => {
                setMenu((prevMenu) => prevMenu.filter((plato) => plato.id !== id));
                setErrorMessage(null);
              })
              .catch((error) => {
                setErrorMessage('Error al eliminar el plato: ' + error.message);
              });
          },
        },
      ]
    );
  };

  const categoriasPlatos = {};
  Object.values(menu).forEach((plato) => {
    const categoria = categorias[plato.categoria_id]?.nombre_categoria || 'Otro';
    if (!categoriasPlatos[categoria]) {
      categoriasPlatos[categoria] = [];
    }
    categoriasPlatos[categoria].push(plato);
  });

  // Ordenar categorías alfabéticamente
  const categoriasOrdenadas = Object.keys(categoriasPlatos).sort();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú</Text>
      <ScrollView style={styles.scrollView}>
        {categoriasOrdenadas.map((categoria) => (
          <View key={categoria}>
            <Text style={styles.categoria}>{categoria}</Text>
            {categoriasPlatos[categoria].map((plato) => (
              <TouchableOpacity
                key={plato.id}
                style={styles.platoContainer}
                onPress={() => handleEliminarPlato(plato.id)}
              >
                <View style={styles.platoInfo}>
                  <Text style={styles.platoNombre}>{plato.nombre_comida}</Text>
                  <Text style={styles.platoPrecio}>{plato.precio_comida}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
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
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  categoria: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  platoContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  platoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platoNombre: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  platoPrecio: {
    fontSize: 18,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default VerMenuScreen;