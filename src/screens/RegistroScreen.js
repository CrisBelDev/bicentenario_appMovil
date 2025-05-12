import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native"; // Importa useNavigation
import {
	View,
	Text,
	TextInput,
	Button,
	Alert,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../services/api"; // Asegúrate de tener la instancia de Axios configurada

export default function RegistroScreen() {
	const [usuario, setUsuario] = useState({
		nombre: "",
		apellido: "",
		correo: "",
		password: "",
		confirmarPassword: "",
		telefono: "",
		pais: "",
		ciudad: "",
		genero: "",
	});

	const [paises, setPaises] = useState([]);
	const [ciudades, setCiudades] = useState([]);
	const [loading, setLoading] = useState(false);

	const navigation = useNavigation(); // Usa useNavigation para obtener el objeto de navegación

	// Obtener países
	useEffect(() => {
		const obtenerPaises = async () => {
			try {
				const { data } = await api.get("/pais");
				setPaises(
					data.map((pais) => ({ value: pais.id_pais, label: pais.nombre }))
				);
			} catch (error) {
				console.error("Error al obtener los países", error);
			}
		};
		obtenerPaises();
	}, []);

	// Obtener ciudades al seleccionar un país
	useEffect(() => {
		const obtenerCiudades = async () => {
			if (usuario.pais) {
				try {
					const { data } = await api.get(`/ciudades/${usuario.pais}`);
					setCiudades(
						data.map((ciudad) => ({
							value: ciudad.id_ciudad,
							label: ciudad.nombre,
						}))
					);
				} catch (error) {
					console.error("Error al obtener las ciudades", error);
				}
			}
		};
		obtenerCiudades();
	}, [usuario.pais]);

	// Actualizar valores de los campos
	const manejarCambio = (name, value) => {
		setUsuario({ ...usuario, [name]: value });
	};

	// Validar contraseñas
	const validarContraseñas = () =>
		usuario.password === usuario.confirmarPassword;

	// Limpiar espacios y validar campos
	const limpiarCampos = (campo) => {
		return String(campo).trim().length > 0;
	};

	// Validar usuario
	const validarUsuario = () => {
		console.log("Validando usuario:", usuario); // Verifica si todos los valores están correctos
		return Object.values(usuario).every(limpiarCampos) && validarContraseñas();
	};

	// Manejo del envío del formulario
	const manejarEnvio = async () => {
		if (!validarContraseñas()) {
			return Alert.alert("Error", "Las contraseñas no coinciden.");
		}
		setLoading(true);
		try {
			await api.post("/usuariosinconfirmacion", usuario); // Ajusta la ruta según tu backend
			Alert.alert("Éxito", "Registro exitoso");
			navigation.navigate("Login"); // Navega al login después de un registro exitoso
		} catch (error) {
			console.error("Error al registrar usuario", error);
			Alert.alert("Error", "Hubo un problema al registrar al usuario.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>Crea tu cuenta</Text>

				<TextInput
					style={styles.input}
					placeholder="Nombre"
					value={usuario.nombre}
					onChangeText={(text) => manejarCambio("nombre", text)}
				/>
				<TextInput
					style={styles.input}
					placeholder="Apellido"
					value={usuario.apellido}
					onChangeText={(text) => manejarCambio("apellido", text)}
				/>
				<TextInput
					style={styles.input}
					placeholder="Correo electrónico"
					value={usuario.correo}
					onChangeText={(text) => manejarCambio("correo", text)}
					keyboardType="email-address"
				/>
				<TextInput
					style={styles.input}
					placeholder="Contraseña"
					value={usuario.password}
					onChangeText={(text) => manejarCambio("password", text)}
					secureTextEntry
				/>
				<TextInput
					style={styles.input}
					placeholder="Confirmar contraseña"
					value={usuario.confirmarPassword}
					onChangeText={(text) => manejarCambio("confirmarPassword", text)}
					secureTextEntry
				/>
				{usuario.password &&
					usuario.confirmarPassword &&
					!validarContraseñas() && (
						<Text style={styles.errorText}>Las contraseñas no coinciden</Text>
					)}

				<TextInput
					style={styles.input}
					placeholder="Teléfono"
					value={usuario.telefono}
					onChangeText={(text) => manejarCambio("telefono", text)}
					keyboardType="phone-pad"
				/>

				{/* Selector de país */}
				<Text style={styles.label}>País</Text>
				<Picker
					selectedValue={usuario.pais}
					style={styles.input}
					onValueChange={(itemValue) => manejarCambio("pais", itemValue)}
				>
					{paises.length === 0 ? (
						<Picker.Item label="Cargando..." value="" />
					) : (
						paises.map((pais) => (
							<Picker.Item
								key={pais.value}
								label={pais.label}
								value={pais.value}
							/>
						))
					)}
				</Picker>

				{/* Selector de ciudad */}
				<Text style={styles.label}>Ciudad</Text>
				<Picker
					selectedValue={usuario.ciudad}
					style={styles.input}
					onValueChange={(itemValue) => manejarCambio("ciudad", itemValue)}
					enabled={!!usuario.pais} // Convierte a booleano
				>
					{ciudades.length === 0 ? (
						<Picker.Item label="Selecciona primero un país" value="" />
					) : (
						ciudades.map((ciudad) => (
							<Picker.Item
								key={ciudad.value}
								label={ciudad.label}
								value={ciudad.value}
							/>
						))
					)}
				</Picker>

				{/* Selector de género */}
				<Text style={styles.label}>Género</Text>
				<Picker
					selectedValue={usuario.genero}
					style={styles.input}
					onValueChange={(itemValue) => manejarCambio("genero", itemValue)}
				>
					<Picker.Item label="Masculino" value="masculino" />
					<Picker.Item label="Femenino" value="femenino" />
					<Picker.Item label="Otro" value="otro" />
				</Picker>

				<View style={{ marginBottom: 20 }} />

				<Button
					title={loading ? "Registrando..." : "Regístrate ahora"}
					onPress={manejarEnvio}
					disabled={!validarUsuario() || loading}
				/>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		flexGrow: 1,
		backgroundColor: "#f8f9fa",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 12,
		marginBottom: 10,
		borderRadius: 8,
		backgroundColor: "#fff",
	},
	label: {
		fontSize: 16,
		marginBottom: 5,
	},
	errorText: {
		color: "red",
		fontSize: 14,
		marginBottom: 10,
	},
});
