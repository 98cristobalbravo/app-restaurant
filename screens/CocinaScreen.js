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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pedidos de Cocina</Text>
      {Object.entries(pedidos)
        .map(([mesaNumero, pedidosMesa]) =>
          Object.entries(pedidosMesa).map(([pedidoId, pedido]) => ({
            pedidoId,
            mesaNumero,
            ...pedido,
          }))
        )
        .flat()
        .sort((pedidoA, pedidoB) => pedidoA.timestamp - pedidoB.timestamp)
        .map((pedido) => (
          <View key={pedido.pedidoId} style={styles.tarjetaContainer}>
            <View style={styles.tarjeta}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>Número de mesa: {pedido.mesaNumero}</Text>
              {Object.entries(pedido.personas).map(([personaId, persona]) => (
                <View key={personaId}>
                  {persona.detalles && persona.detalles.length > 0 && (
                    <Text>Detalles: {persona.detalles.join(', ')}</Text>
                  )}
                  {Object.entries(persona.seleccionados).map(([platoId, cantidad]) => {
                    const plato = menu[platoId];
                    if (plato && plato.seccion === 'Cocina') {
                      return (
                        <View key={platoId}>
                          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Cantidad: {cantidad}</Text>
                          <Text style={{ ...styles.platoNombre, fontSize: 20, fontWeight: 'bold'  }}>Pedido: {plato.nombre_comida}</Text>
                          <Text style={{ fontSize: 20 }}>Categoría: {categorias[plato.categoria_id]?.nombre_categoria}</Text>
                          <Text style={styles.encabezado}>Pedido ID: {pedido.pedidoId}</Text>
                        </View>
                      );
                    } else {
                      return null;
                    }
                  })}
                </View>
              ))}
            </View>
          </View>
        ))}
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </ScrollView>
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
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
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
