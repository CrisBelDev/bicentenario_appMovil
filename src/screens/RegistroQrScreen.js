import React, { useEffect, useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
	AppState,
	Platform,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	View,
	Button,
	Alert,
} from "react-native";

/*
{
para hacer el registro del qr de asistencia a la siguiente ruta : asistencia/registrar
con la siguiente estructura:
  "id_evento": xxx,
  "id_usuario": "xxxx"
}

*/
import axios from "../services/api.js";
export default function QrScanner() {
	const [permission, requestPermission] = useCameraPermissions();
	const qrLock = useRef(false);
	const appState = useRef(AppState.currentState);

	useEffect(() => {
		const subscription = AppState.addEventListener("change", (nextAppState) => {
			if (
				appState.current.match(/inactive|background/) &&
				nextAppState === "active"
			) {
				qrLock.current = false;
			}
			appState.current = nextAppState;
		});

		return () => {
			subscription.remove();
		};
	}, []);

	if (!permission) return null;

	if (!permission.granted) {
		return (
			<View style={styles.center}>
				<Text>Necesitamos permiso para usar la cámara</Text>
				<Button title="Permitir cámara" onPress={requestPermission} />
			</View>
		);
	}

	const handleQRCodeScanned = async ({ data }) => {
		if (data && !qrLock.current) {
			qrLock.current = true;

			console.log("📷 QR escaneado:", data);

			try {
				const parsed = JSON.parse(data);

				// Validar que tenga los campos necesarios
				if (!parsed.eventoId || !parsed.usuarioId) {
					throw new Error("QR inválido: faltan campos.");
				}

				// Adaptar al formato esperado por tu backend
				const payload = {
					id_evento: parsed.eventoId,
					id_usuario: parsed.usuarioId,
				};

				// Enviar a la API
				const response = await axios.post("/asistencia/registrar", payload);

				Alert.alert(
					"Asistencia registrada",
					response.data?.mensaje || "Registro exitoso",
					[{ text: "OK", onPress: () => (qrLock.current = false) }]
				);
			} catch (error) {
				console.error("❌ Error escaneando QR:", error);
				Alert.alert("Error", error.message || "Error al registrar asistencia", [
					{ text: "OK", onPress: () => (qrLock.current = false) },
				]);
			}
		}
	};

	return (
		<SafeAreaView style={StyleSheet.absoluteFillObject}>
			{Platform.OS === "android" ? <StatusBar hidden /> : null}

			<CameraView
				style={StyleSheet.absoluteFillObject}
				facing="back"
				onBarcodeScanned={handleQRCodeScanned}
				barCodeScannerSettings={{ barCodeTypes: ["qr"] }}
			>
				{/* Marco para centrar el QR */}
				<View style={styles.overlay}>
					<View style={styles.qrFrame} />
				</View>
			</CameraView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	overlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	qrFrame: {
		width: 250,
		height: 250,
		borderWidth: 4,
		borderColor: "#00FF00",
		borderRadius: 12,
		backgroundColor: "transparent",
	},
});
