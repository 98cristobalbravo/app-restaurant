import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';
import firebase from '../config/firebase';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener el cargo del usuario desde Firebase Authentication
      const userCargo = user.displayName;

      // Redirigir a la pantalla correspondiente según el cargo del usuario
      switch (userCargo) {
        case 'garzon':
          navigation.navigate('GarzonScreen');
          break;
        case 'cocinero':
          navigation.navigate('CocineroScreen');
          break;
        case 'administrador':
          navigation.navigate('AdminScreen');
          break;
        default:
          // En caso de que el cargo no esté definido, mostrar un mensaje de error
          setErrorMessage('Cargo de usuario no válido');
      }
    } catch (error) {
      setErrorMessage('Error al iniciar sesión: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pecados café</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        onChangeText={setEmail}
        value={email}
        placeholderTextColor="#999" // Lighter text for placeholder
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        placeholderTextColor="#999" // Lighter text for placeholder
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2', // Light gray background
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333', // Darker gray text for better contrast
  },
  input: {
    width: '80%',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd', // Very light gray border
    borderRadius: 5,
    backgroundColor: '#fff', // White input background
  },
  button: {
    width: '80%',
    backgroundColor: '#28a745', // Green button
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#ccc', // Light gray shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff', // White text on button
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#dc3545', // Red error message
    marginTop: 10,
  },
});

export default Login;
