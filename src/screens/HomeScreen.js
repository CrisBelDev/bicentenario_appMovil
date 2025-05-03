import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
	const { user, setUser } = useContext(AuthContext);

	const handleLogout = () => {
		setUser(null); // Borrar datos de sesión
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Bienvenido, {user?.nombre} {user?.apellido}
			</Text>
			<Text style={styles.subtitle}>Rol: {user?.rol}</Text>

			{/* Ejemplo de botón para ir a otra pantalla */}
			<Button
				title="Ir a perfil"
				onPress={() => navigation.navigate("Perfil")}
			/>

			<View style={{ marginTop: 20 }}>
				<Button title="Cerrar sesión" onPress={handleLogout} color="red" />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
	subtitle: { fontSize: 18, color: "gray", marginBottom: 20 },
});
