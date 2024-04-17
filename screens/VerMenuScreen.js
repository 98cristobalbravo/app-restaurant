import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import firebase from '../config/firebase';

const VerMenuScreen = () => {
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase(firebase);
      const menuRef = ref(db, 'menu');

      onValue(menuRef, (snapshot) => {
        const data = snapshot.val();
        setMenu(data || {});
        setLoading(false);
      });
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando menú...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú</Text>
      <ScrollView style={styles.scrollView}>
        {Object.keys(menu).map((categoria) => (
          <View key={categoria}>
            <Text style={styles.subtitle}>{categoria}</Text>
            {menu[categoria].map((plato, index) => (
              <Text key={index} style={styles.plato}>
                {plato}
              </Text>
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
  subtitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left',
  },
  plato: {
    fontSize: 16,
    marginBottom: 5,
  },
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 500,
    width: '100%',
  },
});

export default VerMenuScreen;
