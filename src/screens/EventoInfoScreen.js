import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	Image,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const EventoInfoScreen = () => {
	const route = useRoute();
	const { id } = route.params;

	const [evento, setEvento] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

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
				const res = await axios.get(
					`https://tuservidor.com/api/evento-detalles/${id}`
				);
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

					data.info_extra = `Platos: ${parseArray(platos_tipicos).join(", ")}\nCocineros: ${parseArray(
						cocineros
					).join(
						", "
					)}\nLugar de preparación: ${lugar_preparacion}\nAbierto al público: ${
						abierto_al_publico ? "Sí" : "No"
					}\nCosto: ${costo_entrada === "0.00" ? "Gratis" : costo_entrada + " Bs"}`;
				}

				if (base.tipo === "academico" && base.evento_academico) {
					const ea = base.evento_academico;
					data.organizado_por = ea.organizado_por;
					data.info_extra = `Modalidad: ${ea.modalidad}\nPonentes: ${parseArray(
						ea.ponentes
					).join(
						", "
					)}\nGratuito: ${ea.es_gratuito ? "Sí" : "No"}\nRequisitos: ${
						ea.requisitos_registro
					}\nEnlace: ${ea.enlace_sesion}`;
				}

				if (base.tipo === "deportivo" && base.evento_deportivo) {
					const ed = base.evento_deportivo;
					data.organizado_por = ed.organizado_por;
					data.info_extra = `Modalidad: ${ed.modalidad}\nCategorías: ${parseArray(
						ed.categorias
					).join(", ")}\nEquipos: ${parseArray(ed.equipos_participantes).join(
						", "
					)}\nPremios: ${parseArray(ed.premios).join(", ")}\nReglas: ${
						ed.reglas
					}\nRequisitos: ${ed.requisitos_participacion}`;
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
			<Image
				source={{ uri: evento.imagen || "https://via.placeholder.com/300" }}
				style={styles.image}
				resizeMode="contain"
			/>
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
			<Text style={styles.text}>{evento.descripcion}</Text>

			{evento.info_extra ? (
				<>
					<Text style={styles.label}>📌 Información adicional:</Text>
					<Text style={styles.text}>{evento.info_extra}</Text>
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
});

export default EventoInfoScreen;
