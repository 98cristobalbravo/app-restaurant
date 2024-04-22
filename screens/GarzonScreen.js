// En GarzonScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const GarzonScreen = ({ navigation }) => {
  const [mesas, setMesas] = useState([
    { id: 'Mesa 1', status: 'libre', personas: [] },
    { id: 'Mesa 2', status: 'libre', personas: [] },
    { id: 'Mesa 3', status: 'libre', personas: [] },
  ]);
  const [pressedMesa, setPressedMesa] = useState(null);
  const [orders, setOrders] = useState([]);

  const updateOrders = (newOrder) => {
    setOrders([...orders, newOrder]);
  };

  const handleAgregarMesa = () => {
    const ultimoNumeroMesa = mesas.reduce((max, mesa) => {
      const numeroMesa = parseInt(mesa.id.split(' ')[1]);
      return numeroMesa > max ? numeroMesa : max;
    }, 0);

    const nuevaMesa = {
      id: `Mesa ${ultimoNumeroMesa + 1}`,
      status: 'libre',
      personas: [],
    };

    setMesas([...mesas, nuevaMesa]);
  };

  const handleLongPressMesa = (mesaId) => {
    setPressedMesa(mesaId);
  };

  const handleMesaPress = (mesaId) => {
    const mesaIndex = parseInt(mesaId.split(' ')[1]) - 1;
    const updatedMesa = { mesaIndex, mesa: mesas[mesaIndex] };
    navigation.navigate('MesaScreen', { mesaNumero: mesaId.split(' ')[1], updatedMesa });
  };

  const showDeleteConfirmation = () => {
    if (pressedMesa) {
      Alert.alert(
        'Eliminar Mesa',
        '¿Estás seguro de que quieres eliminar esta mesa?',
        [
          { text: 'Sí', onPress: () => handleDeleteMesa() },
          { text: 'No', onPress: () => setPressedMesa(null), style: 'cancel' }
        ],
        { cancelable: true }
      );
    }
  };

  const handleDeleteMesa = () => {
    const updatedMesas = mesas.filter(mesa => mesa.id !== pressedMesa);
    setMesas(updatedMesas);
    setPressedMesa(null);
  };

  useEffect(() => {
    if (pressedMesa) {
      showDeleteConfirmation();
    }
  }, [pressedMesa]);

  const navigateToCocinaScreen = () => {
    navigation.navigate('CocinaScreen');
  };

  const navigateToCafeteriaScreen = () => {
    navigation.navigate('CafeteriaScreen');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cocinaButton} onPress={navigateToCocinaScreen}>
        <Text style={styles.cocinaButtonText}>Ir a Cocina</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cocinaButton} onPress={navigateToCafeteriaScreen}>
        <Text style={styles.cocinaButtonText}>Ir a Cafetería</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Listo para Servir</Text>
      <View style={styles.tablesContainer}>
        <Text style={styles.tablesTitle}>Mesas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mesas.map((mesa, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.table, mesa.status === 'ocupada' ? styles.ocupada : styles.libre]}
              onPress={() => handleMesaPress(mesa.id)}
              onLongPress={() => handleLongPressMesa(mesa.id)}
            >
              <Text style={styles.tableText}>{mesa.id}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={handleAgregarMesa}>
            <Text style={styles.addButtonLabel}>Agregar Mesa</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <Text style={styles.ordersTitle}>Pedidos enviados por cocina</Text>
      <ScrollView>
        {orders.map((order, index) => (
          <View key={index} style={styles.orderContainer}>
            <Text style={styles.orderText}>Mesa: {order.table}</Text>
            <Text style={styles.orderText}>Detalle Pedidos:</Text>
            {order.items.map((item, idx) => (
              <Text key={idx} style={styles.orderItem}>{item}</Text>
            ))}
            <TouchableOpacity style={styles.entregadoButton} onPress={() => console.log('Entregado')}>
              <Text style={styles.entregadoButtonText}>Entregado</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      {showDeleteConfirmation()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#263238',
  },
  tablesContainer: {
    marginBottom: 20,
  },
  tablesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#263238', 
  },
  table: {
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tableText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ccc', 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', 
  },
  libre: {
    backgroundColor: '#d4edda',
  },
  ocupada: {
    backgroundColor: '#f8d7da',
  },
  ordersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#263238', 
  },
  orderContainer: {
    borderWidth: 1,
    borderColor: '#ccc', 
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderText: {
    fontSize: 16,
    color: '#263238', 
  },
  orderItem: {
    marginLeft: 20,
    fontSize: 14,
    color: '#666', 
  },
  entregadoButton: {
    backgroundColor: '#28a745', 
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  entregadoButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', 
  },
  cocinaButton: {
    backgroundColor: '#ffc107', 
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cocinaButtonText: {
    fontSize: 16,

    fontWeight: 'bold',
    color: '#333',
  },
});

export default GarzonScreen;
