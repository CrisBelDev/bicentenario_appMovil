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

	const handleQRCodeScanned = ({ data }) => {
		if (data && !qrLock.current) {
			qrLock.current = true;
			Alert.alert("QR Detectado", data, [
				{
					text: "OK",
					onPress: () => {
						qrLock.current = false;
					},
				},
			]);
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
