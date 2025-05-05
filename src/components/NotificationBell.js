import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "../services/api.js";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const NotificationBell = () => {
	const navigation = useNavigation();
	const { user } = useContext(AuthContext);
	const userId = user?.idUsuario;

	const [noLeidas, setNoLeidas] = useState(0);

	const fetchNotificaciones = async () => {
		if (!userId) return;
		try {
			const { data } = await axios.get(`/notificacion/usuario/${userId}`);
			const sinLeer = data.notificaciones.filter((n) => !n.leido).length;
			setNoLeidas(sinLeer);
		} catch (error) {
			console.error("Error al obtener notificaciones:", error);
		}
	};

	useEffect(() => {
		fetchNotificaciones(); // Llamada inicial
		const interval = setInterval(fetchNotificaciones, 30000); // Cada 30s
		return () => clearInterval(interval);
	}, [userId]);

	// 🔁 Se ejecuta cada vez que el componente recupera el enfoque
	useFocusEffect(
		useCallback(() => {
			fetchNotificaciones();
		}, [userId])
	);

	const handlePress = () => {
		navigation.push("Notificaciones");
	};

	return (
		<TouchableOpacity onPress={handlePress}>
			<View style={styles.iconContainer}>
				<Icon name="bell" size={24} color="#000" />
				{noLeidas > 0 && (
					<View style={styles.badge}>
						<Text style={styles.badgeText}>{noLeidas}</Text>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	iconContainer: {
		padding: 10,
	},
	badge: {
		position: "absolute",
		right: 5,
		top: 5,
		backgroundColor: "red",
		borderRadius: 8,
		width: 16,
		height: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	badgeText: {
		color: "white",
		fontSize: 10,
		fontWeight: "bold",
	},
});

export default NotificationBell;
