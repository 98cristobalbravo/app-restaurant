import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { Picker as RNPicker } from '@react-native-picker/picker';
import firebase from '../config/firebase';

const Registro = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargo, setCargo] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSignUp = async () => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar el cargo como parte del displayName del usuario
      await updateProfile(user, { displayName: cargo });

      setSuccessMessage(`Trabajador ${nombre} creado exitosamente como ${cargo}.`);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Error al registrar usuario: ' + error.message);
      setSuccessMessage(null);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Trabajadores</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        onChangeText={setNombre}
        value={nombre}
      />
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

      <RNPicker
        selectedValue={cargo}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setCargo(itemValue)}>
        <RNPicker.Item label="Selecciona un cargo" value="" />
        <RNPicker.Item label="Garzón" value="garzon" />
        <RNPicker.Item label="Cocinero" value="cocinero" />
        <RNPicker.Item label="Administrador" value="administrador" />
      </RNPicker>

      <TouchableOpacity onPress={handleSignUp} style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, 
    backgroundColor: 'white', 
  },
  title: {
    fontSize: 30, 
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',  
  },
  input: {
    width: '100%', 
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff', 
  },
  button: {
    width: '100%',  
    backgroundColor: '#28a745', 
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#ccc', 
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',  
    fontWeight: 'bold',
    fontSize: 17,
  },
  picker: {
    width: '100%', 
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff', 
  },
  loginButton: {
    marginTop: 20, 
  },
  loginButtonText: {
    color: '#28a745', 
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Registro;
