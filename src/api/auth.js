import axios from "axios";

const API_URL = "http://192.168.17.2:5000";

export const login = async (correo, password) => {
	const response = await axios.post(`${API_URL}/login`, { correo, password });
	console.log("Respuesta del login:", response.data); // Agregado para depuración
	return response.data;
};
