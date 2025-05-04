// File: src/screens/EventosScreen.js
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	FlatList,
	Image,
	ActivityIndicator,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "../services/api.js";
import { useNavigation } from "@react-navigation/native";

const EventosScreen = () => {
	const [eventos, setEventos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagina, setPagina] = useState(1);
	const [totalPaginas, setTotalPaginas] = useState(1);

	const [busqueda, setBusqueda] = useState("");
	const [tipo, setTipo] = useState("");
	const [modoBusqueda, setModoBusqueda] = useState(false);

	const navigation = useNavigation();

	const cargarEventos = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await axios.get("/evento/mostrarPaginas", {
				params: { page: pagina, limit: 3 },
			});
			console.log("Eventos paginados:", response.data); // Aquí se asegura de ver los datos
			const eventosProcesados = response.data.eventos.map((evento) => ({
				...evento,
				imagenes: evento.imagenes
					? evento.imagenes.split(",").map((url) => url.trim())
					: [],
			}));

			setEventos(eventosProcesados);
			setTotalPaginas(response.data.totalPages || 1);
		} catch (err) {
			setError("No se pudieron cargar los eventos.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!modoBusqueda) {
			cargarEventos();
		}
	}, [pagina]);

	const buscarEventos = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`/evento-buscar`, {
				params: { tipo, titulo: busqueda },
			});
			console.log("Eventos buscados:", response.data.eventos); // Aquí se asegura de ver los datos
			const eventosFiltrados = response.data.eventos.map((evento) => ({
				...evento,
				imagenes: evento.imagenes
					? evento.imagenes.split(",").map((url) => url.trim())
					: [],
			}));

			setEventos(eventosFiltrados);
			setModoBusqueda(true);
		} catch (err) {
			setEventos([]);
			setError("No se encontraron eventoss.");
		} finally {
			setLoading(false);
		}
	};

	const limpiarBusqueda = () => {
		setBusqueda("");
		setTipo("");
		setModoBusqueda(false);
		setPagina(1);
		cargarEventos();
	};

	const renderItem = ({ item }) => (
		<TouchableOpacity
			style={styles.card}
			onPress={() =>
				navigation.navigate("EventoDetalle", { id: item.id_evento })
			}
		>
			<Image
				source={{
					uri: item.imagenes[0] || "https://via.placeholder.com/150",
				}}
				style={styles.image}
			/>
			<View style={styles.info}>
				<Text style={styles.titulo}>{item.titulo}</Text>
				<Text numberOfLines={3} style={styles.descripcion}>
					{item.descripcion.replace(/<[^>]+>/g, "")}
				</Text>
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.input}
					placeholder="Buscar por título"
					value={busqueda}
					onChangeText={setBusqueda}
				/>
				<Picker
					selectedValue={tipo}
					onValueChange={(value) => setTipo(value)}
					style={styles.picker}
				>
					<Picker.Item label="Todos los tipos" value="" />
					<Picker.Item label="Cultural" value="cultural" />
					<Picker.Item label="Académico" value="academico" />
					<Picker.Item label="Deportivo" value="deportivo" />
					<Picker.Item label="Gastronómico" value="gastronomico" />
				</Picker>
				<Button title="Buscar" onPress={buscarEventos} />
				{modoBusqueda && <Button title="Limpiar" onPress={limpiarBusqueda} />}
			</View>

			{loading ? (
				<ActivityIndicator size="large" color="#0000ff" />
			) : error ? (
				<Text style={styles.error}>{error}</Text>
			) : (
				<FlatList
					data={eventos}
					renderItem={renderItem}
					keyExtractor={(item) => item.id_evento.toString()}
				/>
			)}

			{!modoBusqueda && (
				<View style={styles.pagination}>
					<Button
						title="← Anterior"
						onPress={() => setPagina((prev) => Math.max(prev - 1, 1))}
						disabled={pagina <= 1}
					/>
					<Text style={{ marginHorizontal: 10 }}>
						Página {pagina} de {totalPaginas}
					</Text>
					<Button
						title="Siguiente →"
						onPress={() =>
							setPagina((prev) => Math.min(prev + 1, totalPaginas))
						}
						disabled={pagina >= totalPaginas}
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 10 },
	searchContainer: { marginBottom: 10 },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 8,
		marginBottom: 10,
	},
	picker: { marginBottom: 10 },
	card: {
		flexDirection: "row",
		marginBottom: 10,
		backgroundColor: "#fff",
		borderRadius: 8,
		overflow: "hidden",
		elevation: 3,
	},
	image: { width: 100, height: 100 },
	info: { flex: 1, padding: 10 },
	titulo: { fontSize: 16, fontWeight: "bold" },
	descripcion: { fontSize: 14, color: "#555" },
	error: { color: "red", textAlign: "center", marginVertical: 20 },
	pagination: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
	},
});

export default EventosScreen;
