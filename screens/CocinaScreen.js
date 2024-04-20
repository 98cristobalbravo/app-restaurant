import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import firebase from '../config/firebase';
import { getDatabase, ref, onValue } from 'firebase/database';

const CocinaScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [menu, setMenu] = useState({});

  useEffect(() => {
    const db = getDatabase(firebase);
    const pedidosRef = ref(db, 'pedidos');
    const menuRef = ref(db, 'menu');

    onValue(pedidosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convertir el objeto de pedidos a un array de pedidos
        const pedidosArray = Object.entries(data).map(([mesaNumero, mesaPedidos]) => ({ mesaNumero, mesaPedidos }));
        
        // Ordenar los pedidos por timestamp de manera correcta
        pedidosArray.sort((a, b) => {
          const timestampA = Object.values(a.mesaPedidos)[0].timestamp;
          const timestampB = Object.values(b.mesaPedidos)[0].timestamp;
          return timestampA - timestampB;
        });

        // Actualizar el estado con los pedidos ordenados
        setPedidos(pedidosArray);
      } else {
        setPedidos([]);
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
    if (menu[platoId]) {
      return menu[platoId].nombre_comida;
    } else {
      return 'Plato Desconocido';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos en Cocina</Text>
      <ScrollView style={styles.scrollView}>
        {pedidos.map(({ mesaNumero, mesaPedidos }) => (
          <View key={mesaNumero} style={styles.tarjeta}>
            <Text style={styles.mesaTitle}>Mesa {mesaNumero}</Text>
            {Object.entries(mesaPedidos).map(([pedidoId, pedido]) => (
              <View key={pedidoId} style={styles.pedidoContainer}>
                <Text style={styles.detallePedido}>Detalle del pedido {pedidoId}:</Text>
                <Text style={styles.timestamp}>Timestamp: {new Date(pedido.timestamp).toLocaleString()}</Text>
                {pedido.personas.map((persona, index) => (
                  <View key={index} style={styles.personaContainer}>
                    <Text style={styles.persona}>Persona: {persona.id}</Text>
                    <Text style={styles.seleccionesTitle}>Selecciones:</Text>
                    <View style={styles.seleccionesContainer}>
                      {Object.entries(persona.seleccionados).map(([platoId, cantidad]) => (
                        <Text key={platoId} style={styles.seleccion}>{cantidad} x {getPlatoNombre(platoId)}</Text>
                      ))}
                    </View>
                    <Text style={styles.detallesTitle}>Detalles:</Text>
                    <View style={styles.detallesContainer}>
                      {persona.detalles.map((detalle, index) => (
                        <Text key={index} style={styles.detalle}>{detalle}</Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mesaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pedidoContainer: {
    marginBottom: 20,
  },
  detallePedido: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timestamp: {
    marginBottom: 10,
  },
  personaContainer: {
    marginBottom: 15,
  },
  persona: {
    fontWeight: 'bold',
  },
  seleccionesTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  seleccionesContainer: {
    marginLeft: 10,
  },
  seleccion: {
    marginLeft: 10,
  },
  detallesTitle: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  detallesContainer: {
    marginLeft: 10,
  },
  detalle: {
    marginLeft: 10,
  },
});

export default CocinaScreen;
