// screens/NotificacionesScreen.js
import React, { useEffect, useState, useContext, useCallback } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import axios from "../services/api.js";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const NotificacionesScreen = () => {
	const { user } = useContext(AuthContext);
	const userId = user?.idUsuario;

	const [notificaciones, setNotificaciones] = useState([]);
	const navigation = useNavigation();

	const fetchNotificaciones = useCallback(async () => {
		try {
			if (!userId) return;
			const { data } = await axios.get(`/notificacion/usuario/${userId}`);
			setNotificaciones(data.notificaciones);
		} catch (error) {
			console.error("Error al obtener notificaciones:", error);
		}
	}, [userId]);

	useEffect(() => {
		if (!userId) return;

		// Ejecutar una vez al cargar
		fetchNotificaciones();

		// Ejecutar cada 30 segundos
		const interval = setInterval(() => {
			fetchNotificaciones();
		}, 30000); // 30 segundos

		// Limpiar intervalo al desmontar
		return () => clearInterval(interval);
	}, [fetchNotificaciones, userId]);

	const marcarComoLeida = useCallback(
		async (id, id_evento) => {
			try {
				await axios.put(`/notificacion/leida/${id}`);
				setNotificaciones((prev) =>
					prev.map((n) => (n.id === id ? { ...n, leido: true } : n))
				);
				navigation.replace("EventoInfo", { id: id_evento });
			} catch (error) {
				console.error("Error al marcar como leída:", error);
			}
		},
		[navigation]
	);

	const renderItem = useCallback(
		({ item }) => (
			<TouchableOpacity
				style={[
					styles.item,
					{ backgroundColor: item.leido ? "#f0f0f0" : "#fff" },
				]}
				onPress={() => marcarComoLeida(item.id, item.id_evento)}
			>
				<Text style={{ fontWeight: item.leido ? "normal" : "bold" }}>
					{item.mensaje}
				</Text>
			</TouchableOpacity>
		),
		[marcarComoLeida]
	);

	if (!userId) {
		return (
			<View style={styles.container}>
				<Text style={styles.emptyText}>Cargando usuario...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{notificaciones.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>
						No tienes notificaciones por el momento.
					</Text>
				</View>
			) : (
				<FlatList
					data={notificaciones}
					keyExtractor={(item) => item.id.toString()}
					renderItem={renderItem}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#fff",
	},
	item: {
		padding: 12,
		borderBottomWidth: 1,
		borderColor: "#ccc",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 50,
	},
	emptyText: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
});

export default NotificacionesScreen;
