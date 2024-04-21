import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import firebase from '../config/firebase';

const CocinaScreen = () => {
  const [pedidos, setPedidos] = useState({});
  const [categorias, setCategorias] = useState({});
  const [menu, setMenu] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const db = getDatabase(firebase);
    const pedidosRef = ref(db, 'pedidos');
    const categoriasRef = ref(db, 'categorias');
    const menuRef = ref(db, 'menu');

    onValue(pedidosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPedidos(data);
      } else {
        setPedidos({});
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

    onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMenu(data);
      } else {
        setMenu({});
      }
    });
  }, []);

  const getPlatoNombre = (platoId) => {
    return menu[platoId]?.nombre_comida || 'Plato no encontrado';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos</Text>
      <ScrollView style={styles.scrollView}>
        {Object.keys(pedidos).map((pedidoId) => {
          const platosEnCocina = Object.values(pedidos[pedidoId]).some((pedido) => {
            return pedido.personas.some((persona) => {
              return Object.keys(persona.seleccionados).some((platoId) => {
                return menu[platoId]?.seccion === 'Cocina';
              });
            });
          });

          if (platosEnCocina) {
            return (
              <View key={pedidoId} style={styles.tarjetaContainer}>
                <View style={styles.tarjeta}>
                  <Text style={styles.encabezado}>Pedido #{pedidoId}</Text>
                  {Object.values(pedidos[pedidoId]).map((pedido) => (
                    <View key={pedido.timestamp}>
                      {pedido.personas.map((persona, index) => (
                        <View key={index}>
                          <Text>Número de mesa: {pedido.nummesa}</Text>
                          {persona.detalles && persona.detalles.length > 0 && (
                            <Text>Detalles: {persona.detalles.join(', ')}</Text>
                          )}
                          {Object.keys(persona.seleccionados).map((platoId) => {
                            if (menu[platoId]?.seccion === 'Cocina') {
                              return (
                                <View key={platoId}>
                                  <Text style={styles.platoNombre}>{getPlatoNombre(platoId)}</Text>
                                  <Text>Categoría: {categorias[menu[platoId]?.categoria_id]?.nombre_categoria}</Text>
                                  <Text>Sección: {menu[platoId]?.seccion}</Text>
                                  <Text>Cantidad: {persona.seleccionados[platoId]}</Text>
                                  <Text>-------------------------------------</Text>
                                </View>
                              );
                            } else {
                              return null;
                            }
                          })}
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            );
          } else {
            return null;
          }
        })}
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
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  tarjetaContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'rgba(204, 219, 232, 0.5)',
    boxShadow: 'inset 3px 3px 6px 0px rgba(204, 219, 232, 1), inset -3px -3px 6px 1px rgba(255, 255, 255, 0.5)',  
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
  },
  encabezado: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  platoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default CocinaScreen;