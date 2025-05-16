import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Button,
	TouchableOpacity,
	Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useScanBarcodes, BarcodeFormat } from "expo-barcode-scanner";

export default function RegistroQrScreen() {
	const [permission, requestPermission] = useCameraPermissions();
	const [facing, setFacing] = useState("back");
	const [scanned, setScanned] = useState(false);

	// Hook para escanear códigos
	const [barcodes, setBarcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
		checkInverted: true,
	});

	React.useEffect(() => {
		if (barcodes.length > 0 && !scanned) {
			setScanned(true);
			Alert.alert("QR Detectado", `Contenido: ${barcodes[0].data}`, [
				{ text: "Ok", onPress: () => setScanned(false) },
			]);
		}
	}, [barcodes]);

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					Necesitamos permiso para usar la cámara
				</Text>
				<Button title="Permitir cámara" onPress={requestPermission} />
			</View>
		);
	}

	const toggleCameraFacing = () => {
		setFacing((current) => (current === "back" ? "front" : "back"));
	};

	return (
		<View style={styles.container}>
			<CameraView
				style={styles.camera}
				facing={facing}
				onBarCodeScanned={null} // No usar acá
				barCodeScannerSettings={{
					barCodeTypes: ["qr"], // No es obligatorio, pero puedes dejarlo
				}}
			/>
			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
					<Text style={styles.text}>Cambiar cámara</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center" },
	message: { textAlign: "center", paddingBottom: 10 },
	camera: { flex: 1 },
	buttonContainer: {
		position: "absolute",
		bottom: 20,
		alignSelf: "center",
		flexDirection: "row",
	},
	button: {
		backgroundColor: "#00000080",
		padding: 10,
		borderRadius: 8,
	},
	text: {
		fontSize: 18,
		color: "white",
		fontWeight: "bold",
	},
});
