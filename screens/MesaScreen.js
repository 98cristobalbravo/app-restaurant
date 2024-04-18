import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import firebase from '../config/firebase';
import { getDatabase, ref, onValue } from 'firebase/database';

const MesaScreen = ({ route, navigation }) => {
  const { mesaNumero } = route.params;
  const [menu, setMenu] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [expanded, setExpanded] = useState(false); // Estado para controlar la expansión

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

  const handleBack = () => {
    navigation.navigate('GarzonScreen', { mesaNumero });
  };

  const handleAgregarPlato = () => {
    const nuevaPersona = {
      id: `Persona ${personas.length + 1}`, // Generar un nuevo identificador único
      seleccionados: {}
    };
    setPersonas([...personas, nuevaPersona]);
  };

  const handleEliminarPersona = (personaId) => {
    const nuevasPersonas = personas.filter(persona => persona.id !== personaId);
    setPersonas(nuevasPersonas);
  };

  const handleSeleccionPlato = (plato, personaId) => {
    const nuevasPersonas = personas.map(persona => {
      if (persona.id === personaId) {
        const seleccionadosActualizados = { ...persona.seleccionados };
        if (seleccionadosActualizados[plato.id]) {
          seleccionadosActualizados[plato.id]++;
        } else {
          seleccionadosActualizados[plato.id] = 1;
        }
        return {
          ...persona,
          seleccionados: seleccionadosActualizados
        };
      }
      return persona;
    });
    setPersonas(nuevasPersonas);
  };

  const categoriasPlatos = {};
  Object.values(menu).forEach((plato) => {
    const categoria = categorias[plato.categoria_id]?.nombre_categoria || 'Otro';
    if (!categoriasPlatos[categoria]) {
      categoriasPlatos[categoria] = [];
    }
    categoriasPlatos[categoria].push(plato);
  });

  const categoriasOrdenadas = Object.keys(categoriasPlatos).sort();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MESA {mesaNumero}</Text>
      <TouchableOpacity style={styles.button} onPress={handleAgregarPlato}>
        <Text style={styles.buttonText}>Agregar Persona</Text>
      </TouchableOpacity>
      {/* Botón para expandir/comprimir */}
      <TouchableOpacity style={styles.expandButton} onPress={() => setExpanded(!expanded)}>
        <Text style={styles.buttonText}>{expanded ? 'Comprimir' : 'Expandir'}</Text>
      </TouchableOpacity>
      <View style={[styles.personasContainer, expanded && { maxHeight: null }]}>
        <ScrollView horizontal={!expanded} style={{ flexDirection: 'row' }}>
          {personas.map(persona => (
            <View key={persona.id} style={styles.personaContainer}>
              <TouchableOpacity onPress={() => handleEliminarPersona(persona.id)}>
                <Text style={{ color: 'red', marginTop: 1, marginBottom: 1, textAlign: 'center' }}>Eliminar</Text>
              </TouchableOpacity>
              <Text style={styles.personaTitle}>{persona.id}</Text>
              <View style={styles.personaPlatosContainer}>
                {Object.entries(persona.seleccionados).map(([platoId, cantidad]) => (
                  <Text key={platoId} style={styles.personaPlato}>{cantidad} - {menu.find(plato => plato.id === platoId).nombre_comida}</Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.menuContainer}>
        {categoriasOrdenadas.map((categoria) => (
          <View key={categoria} style={styles.categoriaContainer}>
            <Text style={styles.categoria}>{categoria}</Text>
            {categoriasPlatos[categoria].map((plato, index) => (
              <TouchableOpacity key={index} style={styles.platoContainer} onPress={() => handleSeleccionPlato(plato, personas.length ? personas[personas.length - 1].id : null)}>
                <View style={styles.platoInfo}>
                  <Text style={styles.platoNombre}>{plato.nombre_comida}</Text>
                  <Text style={styles.platoPrecio}>${plato.precio_comida}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Volver a GarzonScreen</Text>
        </TouchableOpacity>
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      </View>
    </ScrollView>
  );

  
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuContainer: {
    marginBottom: 20,
  },
  categoriaContainer: {
    marginBottom: 20,
  },
  categoria: {
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  platoPrecio: {
    fontSize: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  bottomContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  personasContainer: {
    maxHeight: 125,
    marginBottom: 20,
    overflow: 'hidden', // Asegura que el contenido oculto no sea visible
  },
  personaContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginTop: 20,
    marginRight: 10, // Agregar espacio entre las personas
    borderRadius: 5,
  },
  personaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  personaPlato: {
    fontSize: 14,
  },
  expandButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default MesaScreen;
