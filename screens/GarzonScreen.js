import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const GarzonScreen = ({ navigation }) => {
  const [mesas, setMesas] = useState([
    { id: 'Mesa 1', status: 'ocupada', personas: [] },
    { id: 'Mesa 2', status: 'libre', personas: [] },
    { id: 'Mesa 3', status: 'ocupada', personas: [] },
  ]);
  const [pressedMesa, setPressedMesa] = useState(null);

  const orders = [
    { table: 'Mesa05', items: ['2nnnn', '1nnnn'] },
  ];

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
    navigation.navigate('MesaScreen', { mesaNumero: mesaId.split(' ')[1], mesaIndex, mesa: mesas[mesaIndex], updateMesas });
  };

  const updateMesas = (updatedMesa) => {
    const updatedMesas = [...mesas];
    updatedMesas[updatedMesa.mesaIndex] = updatedMesa;
    setMesas(updatedMesas);
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

  return (
    <View style={styles.container}>
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tablesContainer: {
    marginBottom: 20,
  },
  tablesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  table: {
    backgroundColor: 'lightgreen',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  tableText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  libre: {
    backgroundColor: 'lightgreen',
  },
  ocupada: {
    backgroundColor: 'lightblue',
  },
  ordersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  orderText: {
    fontSize: 16,
  },
  orderItem: {
    marginLeft: 20,
    fontSize: 14,
  },
  entregadoButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  entregadoButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GarzonScreen;
