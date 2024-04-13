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

      // Verificar el cargo del usuario (aquí puedes implementar la lógica específica para tu base de datos o datos de usuario)
      const userCargo = 'garzon'; // Supongamos que obtenemos el cargo del usuario desde la base de datos

      // Redirigir a la pantalla correspondiente según el cargo del usuario
      switch (userCargo) {
        case 'garzon':
          navigation.navigate('GarzonScreen');
          break;
        case 'cocinero':
          navigation.navigate('CocineroScreen');
          break;
        case 'administrador':
          navigation.navigate('AdministradorScreen');
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
      <Text style={styles.title}>Inicio de Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
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
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    width: '80%',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
});

export default Login;
