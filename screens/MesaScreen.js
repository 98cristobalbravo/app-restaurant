import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native';
import firebase from '../config/firebase';
import { getDatabase, ref, onValue } from 'firebase/database';

const MesaScreen = ({ route, navigation }) => {
  const { mesaNumero } = route.params;
  const [menu, setMenu] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [expanded, setExpanded] = useState(false); // Estado para controlar la expansión
  const [detallesPedido, setDetallesPedido] = useState(""); // Estado para almacenar los detalles adicionales ingresados por el usuario
  const [selectedPersona, setSelectedPersona] = useState(null); // Estado para mantener la persona seleccionada
  const personasScrollViewRef = useRef(null); // Referencia para el ScrollView de personas

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
      id: Date.now().toString(), // Generar un nuevo identificador único
      seleccionados: {},
      detalles: [] // Inicializar el array de detalles
    };
    setPersonas([...personas, nuevaPersona]);
    setSelectedPersona(nuevaPersona.id); // Seleccionar automáticamente la persona recién creada
    scrollToBottom(); // Llama a la función para hacer scroll al final
  };

  // Función para hacer scroll al final de la lista de personas
  const scrollToBottom = () => {
    if (personasScrollViewRef.current) {
      personasScrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleEliminarPersona = (personaId) => {
    const nuevasPersonas = personas.filter(persona => persona.id !== personaId);
    setPersonas(nuevasPersonas);
    if (selectedPersona === personaId) {
      setSelectedPersona(null);
    }
  };

  const handleSeleccionPersona = (personaId) => {
    setSelectedPersona(personaId);
  };

  const handleSeleccionPlato = (plato, action) => {
    if (selectedPersona) {
      const nuevasPersonas = personas.map(persona => {
        if (persona.id === selectedPersona) {
          const seleccionadosActualizados = { ...persona.seleccionados };
          if (action === 'add') {
            if (seleccionadosActualizados[plato.id]) {
              seleccionadosActualizados[plato.id]++;
            } else {
              seleccionadosActualizados[plato.id] = 1;
            }
          } else if (action === 'remove') {
            if (seleccionadosActualizados[plato.id] > 0) {
              seleccionadosActualizados[plato.id]--;
              if (seleccionadosActualizados[plato.id] === 0) {
                delete seleccionadosActualizados[plato.id];
              }
            }
          }
          return {
            ...persona,
            seleccionados: seleccionadosActualizados
          };
        }
        return persona;
      });
      setPersonas(nuevasPersonas);
    }
  };

  const handleGuardarDetalles = () => {
    // Agregar detalles adicionales al pedido de la persona seleccionada
    const personaSeleccionada = personas.find(persona => persona.id === selectedPersona);
    if (personaSeleccionada) {
      const nuevosDetalles = [...personaSeleccionada.detalles, detallesPedido]; // Agregar el nuevo detalle al array de detalles
      const personaActualizada = { ...personaSeleccionada, detalles: nuevosDetalles };
      const nuevasPersonas = personas.map(persona =>
        persona.id === selectedPersona ? personaActualizada : persona
      );
      setPersonas(nuevasPersonas);
      setDetallesPedido(""); // Limpiar el input de detalles
    }
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
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>MESA {mesaNumero}</Text>
        <TouchableOpacity style={styles.button} onPress={handleAgregarPlato}>
          <Text style={styles.buttonText}>Agregar Pedido</Text>
        </TouchableOpacity>
        {/* Botón para expandir/comprimir */}
        <TouchableOpacity style={styles.expandButton} onPress={() => setExpanded(!expanded)}>
          <Text style={styles.buttonText}>{expanded ? 'Comprimir' : 'Expandir'}</Text>
        </TouchableOpacity>
        <View style={[styles.personasContainer, expanded && { maxHeight: null }]}>
          <ScrollView
            horizontal={!expanded}
            style={{ flexDirection: 'row' }}
            ref={personasScrollViewRef} // Asigna la referencia al ScrollView de personas
          >
            {personas.map(persona => (
              <TouchableOpacity key={persona.id} onPress={() => handleSeleccionPersona(persona.id)} style={[styles.personaContainer, selectedPersona === persona.id && styles.selectedPersona]}>
                <TouchableOpacity onPress={() => handleEliminarPersona(persona.id)}>
                  <Text style={styles.eliminarButton}>ELIMINAR</Text>
                </TouchableOpacity>
                <Text style={styles.personaTitle}>{persona.id}</Text>
                <View style={styles.personaPlatosContainer}>
                  {Object.entries(persona.seleccionados).map(([platoId, cantidad]) => (
                    <Text key={platoId} style={styles.personaPlato}>{cantidad} - {menu.find(plato => plato.id === platoId).nombre_comida}</Text>
                  ))}
                  {persona.detalles && persona.detalles.map((detalle, index) => (
                    <Text key={index} style={styles.personaPlato}>Detalle: {detalle}</Text>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.menuContainer}>
          {categoriasOrdenadas.map((categoria) => (
            <View key={categoria} style={styles.categoriaContainer}>
              <Text style={styles.categoria}>{categoria}</Text>
              {categoriasPlatos[categoria].map((plato, index) => (
                <View key={index} style={styles.platoContainer}>
                  <View style={styles.platoInfo}>
                    <Text style={styles.platoNombre}>{plato.nombre_comida}</Text>
                    <Text style={styles.platoPrecio}>${plato.precio_comida}</Text>
                  </View>
                  <View style={styles.platoButtons}>
                    <TouchableOpacity onPress={() => handleSeleccionPlato(plato, 'remove')} style={[styles.platoButton, styles.platoButtonRemove]}>
                      <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSeleccionPlato(plato, 'add')} style={[styles.platoButton, styles.platoButtonAdd]}>
                      <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
        
        {/* Input para detalles adicionales */}
        <View style={styles.detallesContainer}>
          <TextInput
            style={styles.input}
            value={detallesPedido}
            onChangeText={setDetallesPedido}
            placeholder="Detalles adicionales..."
          />
          <TouchableOpacity style={styles.button} onPress={handleGuardarDetalles}>
            <Text style={styles.buttonText}>Agregar detalle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>Volver a GarzonScreen</Text>
          </TouchableOpacity>
          {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
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
    backgroundColor: '#e6f3f8',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  platoPrecio: {
    fontSize: 16,
  },
  platoButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platoButton: {
    width: 50,
    height: 40,
    borderRadius: 7 ,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  platoButtonRemove: {
    backgroundColor: '#ff9999',
  },
  platoButtonAdd: {
    backgroundColor: '#a2ff99',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'purple',
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
  selectedPersona: {
    backgroundColor: '#e6f3f8',
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
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'purple',
  },
  detallesContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  eliminarButton: {
    fontWeight: 'bold',
    color: 'red',
    marginTop: 1,
    marginBottom: 2,
    textAlign: 'center',
  },
});

export default MesaScreen;
