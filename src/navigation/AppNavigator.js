// src/navigation/AppNavigator.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import EventosScreen from "../screens/EventosScreen";
import EventoInfoScreen from "../screens/EventoInfoScreen";
import NotificacionesScreen from "../screens/NotificacionesScreen";
import LogoutScreen from "../screens/LogoutScreen";
import RegistroScreen from "../screens/RegistroScreen";
import RegistroQrScreen from "../screens/RegistroQrScreen";

import { AuthContext } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Menú lateral
const DrawerNavigator = () => {
	const { user } = useContext(AuthContext); // ← aquí accedemos al contexto

	return (
		<Drawer.Navigator initialRouteName="Home">
			<Drawer.Screen
				name="Home"
				component={HomeScreen}
				options={{
					title: "Inicio",
					headerRight: () => <NotificationBell />,
				}}
			/>
			<Drawer.Screen
				name="Eventos"
				component={EventosScreen}
				options={{
					title: "Eventos",
					headerRight: () => <NotificationBell />,
				}}
			/>
			<Drawer.Screen
				name="Cerrar Sesión"
				component={LogoutScreen}
				options={{ headerShown: false }}
			/>

			{user.rol && (
				<Drawer.Screen
					name="Escanear QR"
					component={RegistroQrScreen}
					options={{
						title: "Escanear QR",
					}}
				/>
			)}
		</Drawer.Navigator>
	);
};

// Usuarios autenticados
const AuthenticatedNavigator = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Main"
			component={DrawerNavigator}
			options={{ headerShown: false }}
		/>
		<Stack.Screen
			name="EventoInfo"
			component={EventoInfoScreen}
			options={{
				title: "Detalle del Evento",
			}}
		/>
		<Stack.Screen
			name="Notificaciones"
			component={NotificacionesScreen}
			options={{ title: "Notificaciones" }}
		/>
	</Stack.Navigator>
);

// Usuarios no autenticados
const UnauthenticatedNavigator = () => (
	<Stack.Navigator initialRouteName="Login">
		<Stack.Screen
			name="Login"
			component={LoginScreen}
			options={{ headerShown: false }}
		/>
		<Stack.Screen
			name="Registro"
			component={RegistroScreen}
			options={{ title: "Registro de Usuario" }}
		/>
	</Stack.Navigator>
);

// Enrutador principal
export default function AppNavigator() {
	const { user } = useContext(AuthContext);

	return (
		<NavigationContainer>
			{user ? <AuthenticatedNavigator /> : <UnauthenticatedNavigator />}
		</NavigationContainer>
	);
}
