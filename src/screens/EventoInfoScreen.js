import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	Image,
	ActivityIndicator,
	StyleSheet,
	Modal,
	Pressable,
} from "react-native";
import axios from "../services/api.js";
import { useRoute } from "@react-navigation/native";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";

const EventoInfoScreen = () => {
	const route = useRoute();
	const { id } = route.params;
	const { width } = useWindowDimensions();

	const [evento, setEvento] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [modalVisible, setModalVisible] = useState(false); // 👈 Nuevo estado

	const parseArray = (data) => {
		try {
			return Array.isArray(JSON.parse(data)) ? JSON.parse(data) : [];
		} catch (e) {
			return [];
		}
	};

	useEffect(() => {
		const fetchEvento = async () => {
			try {
				const res = await axios.get(`/evento-detalles/${id}`);
				const base = res.data.evento;

				let data = {
					titulo: base.titulo,
					fecha_inicio: base.fecha_inicio,
					fecha_fin: base.fecha_fin,
					lugar: base.lugar,
					descripcion: base.descripcion,
					imagen: base.imagenes,
					tipo_evento: base.tipo,
					organizado_por: "",
					info_extra: "",
				};

				if (base.tipo === "cultural" && base.evento_cultural) {
					data.organizado_por = base.evento_cultural.organizado_por;
				}

				if (base.tipo === "gastronomico" && base.evento_gastronomico) {
					const {
						platos_tipicos,
						cocineros,
						lugar_preparacion,
						abierto_al_publico,
						costo_entrada,
					} = base.evento_gastronomico;

					data.info_extra = `
						<div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
							<p style="font-weight: bold;">🍽️ Platos típicos:</p>
							<p>${parseArray(platos_tipicos).join(", ")}</p>

							<p style="font-weight: bold;">👨‍🍳 Cocineros:</p>
							<p>${parseArray(cocineros).join(", ")}</p>

							<p style="font-weight: bold;">📍 Lugar de preparación:</p>
							<p>${lugar_preparacion}</p>

							<p style="font-weight: bold;">🌍 Abierto al público:</p>
							<p>${abierto_al_publico ? "Sí" : "No"}</p>

							<p style="font-weight: bold;">💰 Costo de entrada:</p>
							<p>${costo_entrada === "0.00" ? "Gratis" : `${costo_entrada} Bs`}</p>
						</div>
					`;
				}

				if (base.tipo === "academico" && base.evento_academico) {
					const ea = base.evento_academico;
					data.organizado_por = ea.organizado_por;
					data.info_extra = `
						<div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
							<p style="font-weight: bold;">🏫 Modalidad:</p>
							<p>${ea.modalidad}</p>

							<p style="font-weight: bold;">🎙️ Ponentes:</p>
							<p>${parseArray(ea.ponentes).join(", ")}</p>

							<p style="font-weight: bold;">💸 Gratuito:</p>
							<p>${ea.es_gratuito ? "Sí" : "No"}</p>

							<p style="font-weight: bold;">📝 Requisitos de registro:</p>
							<p>${ea.requisitos_registro}</p>

							<p style="font-weight: bold;">🔗 Enlace a la sesión:</p>
							<p>${ea.enlace_sesion}</p>
						</div>
					`;
				}

				if (base.tipo === "deportivo" && base.evento_deportivo) {
					const ed = base.evento_deportivo;
					data.organizado_por = ed.organizado_por;
					data.info_extra = `
						<div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
							<p style="font-weight: bold;">🏃 Modalidad:</p>
							<p>${ed.modalidad}</p>

							<p style="font-weight: bold;">🏅 Categorías:</p>
							<p>${parseArray(ed.categorias).join(", ")}</p>

							<p style="font-weight: bold;">🤝 Equipos participantes:</p>
							<p>${parseArray(ed.equipos_participantes).join(", ")}</p>

							<p style="font-weight: bold;">🎁 Premios:</p>
							<p>${parseArray(ed.premios).join(", ")}</p>

							<p style="font-weight: bold;">📜 Reglas:</p>
							<p>${ed.reglas}</p>

							<p style="font-weight: bold;">📋 Requisitos:</p>
							<p>${ed.requisitos_participacion}</p>
						</div>
					`;
				}

				setEvento(data);
			} catch (err) {
				console.error(err);
				setError("No se pudo cargar la información del evento.");
			} finally {
				setLoading(false);
			}
		};

		fetchEvento();
	}, [id]);

	if (loading)
		return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
	if (error) return <Text style={styles.error}>{error}</Text>;

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>{evento.titulo}</Text>

			{/* Imagen pequeña que abre el modal */}
			<Pressable onPress={() => setModalVisible(true)}>
				<Image
					source={{ uri: evento.imagen || "https://via.placeholder.com/300" }}
					style={styles.image}
					resizeMode="contain"
				/>
			</Pressable>

			{/* Modal de imagen en grande */}
			<Modal visible={modalVisible} transparent={true}>
				<View style={styles.modalBackground}>
					<Pressable
						style={styles.modalCloseArea}
						onPress={() => setModalVisible(false)}
					/>
					<View style={styles.modalContent}>
						<Image
							source={{
								uri: evento.imagen || "https://via.placeholder.com/300",
							}}
							style={styles.fullImage}
							resizeMode="contain"
						/>
					</View>
				</View>
			</Modal>

			<Text style={styles.label}>📅 Fecha:</Text>
			<Text style={styles.text}>
				Desde {new Date(evento.fecha_inicio).toLocaleDateString()} hasta{" "}
				{new Date(evento.fecha_fin).toLocaleDateString()}
			</Text>
			<Text style={styles.label}>📍 Lugar:</Text>
			<Text style={styles.text}>{evento.lugar}</Text>

			{evento.organizado_por ? (
				<>
					<Text style={styles.label}>👥 Organizado por:</Text>
					<Text style={styles.text}>{evento.organizado_por}</Text>
				</>
			) : null}

			<Text style={styles.label}>📝 Descripción:</Text>
			<RenderHtml
				contentWidth={width}
				source={{ html: evento.descripcion }}
				tagsStyles={{
					p: { fontSize: 16, marginBottom: 10, color: "#333" },
					strong: { fontWeight: "bold" },
				}}
			/>

			{evento.info_extra ? (
				<>
					<Text style={styles.label}>📌 Información adicional:</Text>
					<RenderHtml
						contentWidth={width}
						source={{ html: evento.info_extra }}
						tagsStyles={{
							p: { fontSize: 16, marginBottom: 10, color: "#333" },
							strong: { fontWeight: "bold" },
						}}
					/>
				</>
			) : null}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 15,
	},
	image: {
		width: "100%",
		height: 200,
		marginBottom: 20,
		borderRadius: 10,
	},
	label: {
		fontWeight: "bold",
		marginTop: 10,
	},
	text: {
		marginBottom: 8,
	},
	error: {
		color: "red",
		textAlign: "center",
		marginTop: 20,
	},
	modalBackground: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.9)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalCloseArea: {
		position: "absolute",
		width: "100%",
		height: "100%",
	},
	modalContent: {
		width: "90%",
		height: "80%",
	},
	fullImage: {
		width: "100%",
		height: "100%",
		borderRadius: 10,
	},
});

export default EventoInfoScreen;
