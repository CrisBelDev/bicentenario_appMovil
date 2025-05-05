// src/screens/LoginScreen.js
import React, { useState, useContext } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	Alert,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import { login } from "../api/auth";
import { useNavigation } from "@react-navigation/native"; // Importa useNavigation
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen() {
	const [correo, setCorreo] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const { setUser } = useContext(AuthContext);

	const navigation = useNavigation(); // Usar useNavigation para acceder a la navegación

	// Validación simple de los campos
	const isValidForm = () => {
		if (!correo || !password) {
			Alert.alert("Error", "Por favor ingresa correo y contraseña.");
			return false;
		}
		// Validación básica del correo
		const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		if (!emailPattern.test(correo)) {
			Alert.alert("Error", "Por favor ingresa un correo electrónico válido.");
			return false;
		}
		return true;
	};

	const handleLogin = async () => {
		if (!isValidForm()) return;

		setLoading(true);
		try {
			const response = await login(correo, password);
			setUser(response); // Guardamos toda la respuesta: token, nombre, rol, etc.
		} catch (error) {
			const msg = error?.response?.data?.mensaje || "Error al iniciar sesión";
			Alert.alert("Error", msg);
		} finally {
			setLoading(false);
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
			<View style={styles.passwordContainer}>
				<TextInput
					placeholder="Contraseña"
					value={password}
					onChangeText={setPassword}
					style={styles.input}
					secureTextEntry={!showPassword}
				/>
				<TouchableOpacity
					onPress={() => setShowPassword(!showPassword)}
					style={styles.showPasswordButton}
				>
					<Text style={styles.showPasswordText}>
						{showPassword ? "Ocultar" : "Ver"}
					</Text>
				</TouchableOpacity>
			</View>
			{loading ? (
				<ActivityIndicator size="large" color="#007BFF" />
			) : (
				<Button title="Ingresar" onPress={handleLogin} color="#007BFF" />
			)}

			<View style={styles.registerLinkContainer}>
				<Text style={styles.registerText}>¿No tienes una cuenta?</Text>
				<TouchableOpacity
					onPress={() => {
						navigation.navigate("Registro"); // Aquí usas navigation
					}}
				>
					<Text style={styles.registerLink}>Regístrate aquí</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
		backgroundColor: "#f8f9fa", // Fondo gris claro para una sensación fresca
	},
	title: {
		fontSize: 28,
		fontWeight: "600",
		color: "#333",
		marginBottom: 30,
		textAlign: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 12,
		marginBottom: 15,
		borderRadius: 8,
		backgroundColor: "#fff",
		fontSize: 16,
		color: "#333",
	},
	passwordContainer: {
		position: "relative",
	},
	showPasswordButton: {
		position: "absolute",
		top: 10,
		right: 10,
	},
	showPasswordText: {
		color: "#007BFF",
		fontSize: 14,
		fontWeight: "bold",
	},
	registerLinkContainer: {
		marginTop: 20,
		alignItems: "center",
	},
	registerText: {
		color: "#666",
		fontSize: 14,
	},
	registerLink: {
		color: "#007BFF",
		fontSize: 16,
		fontWeight: "600",
	},
});
