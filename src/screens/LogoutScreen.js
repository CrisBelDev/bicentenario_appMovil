// src/screens/LogoutScreen.js
import React, { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LogoutScreen() {
	const { setUser } = useContext(AuthContext);

	useEffect(() => {
		setUser(null);
	}, []);

	return null; // No se renderiza nada
}
