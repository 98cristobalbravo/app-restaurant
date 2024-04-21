import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CocineroScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administrar pedidos</Text>
      <TouchableOpacity
        style={[styles.buttonContainer, styles.customButtonLarge]}
        onPress={() => navigation.navigate('CocinaScreen')}
      >
        <Text style={styles.buttonText}>Pedidos de Cocina</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.buttonContainer, styles.customButtonLarge]}
        onPress={() => navigation.navigate('CafeteriaScreen')}
      >
        <Text style={styles.buttonText}>Pedidos de Cafetería</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '70%',
    backgroundColor: '#c79863',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  customButtonLarge: {
    fontSize: 18,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default CocineroScreen;
