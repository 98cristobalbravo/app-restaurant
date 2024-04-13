import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const MesaScreen = ({ route, navigation }) => {
  const { mesaNumero } = route.params; // Obtener el número de mesa desde la prop route.params
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    // Puedes implementar lógica para cargar las personas de la mesa desde una base de datos o donde estén almacenadas
    // Aquí lo dejaremos vacío para simplificar
  }, []);

  const agregarPersona = () => {
    const nuevaPersona = `Persona ${personas.length + 1}`;
    setPersonas([...personas, nuevaPersona]);
  };

  const handleBack = () => {
    // Actualizar las personas en la mesa correspondiente en GarzonScreen
    navigation.navigate('GarzonScreen', { mesaNumero, personas });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MESA {mesaNumero}</Text>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Personas</Text>
        <ScrollView>
          {personas.map((persona, index) => (
            <TouchableOpacity key={index} style={styles.personaButton} onPress={() => console.log(`Menú de ${persona}`)}>
              <Text style={styles.personaButtonText}>{persona}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={agregarPersona}>
          <Text style={styles.buttonText}>Agregar Persona</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Resumen Comanda</Text>
        {/* Aquí podrías mostrar el resumen de la comanda de la mesa */}
        {/* Por ejemplo, cantidad de productos y detalles */}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleBack}>
        <Text style={styles.buttonText}>Volver a GarzonScreen</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  personaButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  personaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default MesaScreen;
