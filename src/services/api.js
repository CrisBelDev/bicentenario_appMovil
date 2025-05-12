// src/services/api.js
import axios from "axios";

// Configura axios
const api = axios.create({
	baseURL: "http://192.168.17.2:5000", // Usa http en lugar de https
	headers: {
		"Content-Type": "application/json",
	},
});

// Exporta la instancia de axios para usarla en los componentes
export default api;
