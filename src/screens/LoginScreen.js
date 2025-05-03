// src/screens/LoginScreen.js
import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { login } from "../api/auth";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen() {
	const [correo, setCorreo] = useState("");
	const [password, setPassword] = useState("");
	const { setUser } = useContext(AuthContext);

	const handleLogin = async () => {
		try {
			const response = await login(correo, password);
			setUser(response); // Guardamos toda la respuesta: token, nombre, rol, etc.
		} catch (error) {
			const msg = error?.response?.data?.mensaje || "Error al iniciar sesión";
			Alert.alert("Error", msg);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Iniciar Sesión</Text>
			<TextInput
				placeholder="Correo"
				value={correo}
				onChangeText={setCorreo}
				style={styles.input}
				autoCapitalize="none"
				keyboardType="email-address"
			/>
			<TextInput
				placeholder="Contraseña"
				value={password}
				onChangeText={setPassword}
				style={styles.input}
				secureTextEntry
			/>
			<Button title="Ingresar" onPress={handleLogin} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center", padding: 20 },
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		marginBottom: 10,
		borderRadius: 5,
	},
});
