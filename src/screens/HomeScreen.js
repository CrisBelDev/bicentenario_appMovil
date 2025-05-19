// src/screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	Image,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	Linking,
} from "react-native";
import axios from "../services/api.js";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
	const navigation = useNavigation();

	const [eventos, setEventos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pagina, setPagina] = useState(1);

	useEffect(() => {
		const fetchEventos = async () => {
			try {
				const response = await axios.get("/evento/mostrarPaginas", {
					params: { page: pagina, limit: 6 },
				});
				const eventosProcesados = response.data.eventos.map((evento) => ({
					...evento,
					imagenes: evento.imagenes
						? evento.imagenes.split(",").map((url) => url.trim())
						: [],
				}));
				setEventos(eventosProcesados);
			} catch (error) {
				console.error("Error al obtener eventos", error);
			} finally {
				setLoading(false);
			}
		};
		fetchEventos();
	}, [pagina]);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			{/* Banner */}
			<View style={styles.banner}>
				<Text style={styles.bannerTitle}>BICENTENARIO DE BOLIVIA</Text>
				<Text style={styles.bannerSubtitle}>
					Celebramos 200 años de independencia, libertad y unidad.
				</Text>
			</View>

			{/* Sobre Nosotros */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Sobre Nosotros</Text>
				<Text style={styles.sectionText}>
					Somos una organización dedicada a promover la cultura e historia
					boliviana.
				</Text>
			</View>

			{/* Eventos */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Eventos Destacados</Text>
				{loading ? (
					<ActivityIndicator size="large" color="#000" />
				) : (
					eventos.map((evento) => (
						<TouchableOpacity
							key={evento.id_evento}
							style={styles.eventCard}
							onPress={() =>
								navigation.navigate("EventoInfo", { id: evento.id_evento })
							}
						>
							<Image
								source={{
									uri: evento.imagenes[0] || "https://via.placeholder.com/150",
								}}
								style={styles.eventImage}
							/>
							<View style={styles.eventInfo}>
								<Text style={styles.eventTitle}>{evento.titulo}</Text>
								<Text>{evento.lugar}</Text>
								<TouchableOpacity
									onPress={() =>
										Linking.openURL(
											`https://www.google.com/maps?q=${evento.ubicacion}`
										)
									}
								>
									<Text style={styles.link}>Ver en Google Maps</Text>
								</TouchableOpacity>
							</View>
						</TouchableOpacity>
					))
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16 },
	banner: {
		backgroundColor: "#000",
		padding: 20,
		borderRadius: 8,
		marginBottom: 20,
	},
	bannerTitle: {
		color: "#fff",
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 10,
	},
	bannerSubtitle: {
		color: "#fff",
		textAlign: "center",
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 8,
	},
	sectionText: {
		fontSize: 16,
	},
	eventCard: {
		flexDirection: "row",
		marginBottom: 16,
		backgroundColor: "#f0f0f0",
		borderRadius: 8,
		overflow: "hidden",
	},
	eventImage: {
		width: 100,
		height: 100,
	},
	eventInfo: {
		flex: 1,
		padding: 10,
	},
	eventTitle: {
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 4,
	},
	link: {
		color: "blue",
		textDecorationLine: "underline",
		marginTop: 4,
	},
	pagination: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	pageButton: {
		padding: 10,
		backgroundColor: "#ddd",
		borderRadius: 5,
	},
});
