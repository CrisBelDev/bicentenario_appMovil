// src/navigation/AppNavigator.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import EventosScreen from "../screens/EventosScreen";
import EventoInfoScreen from "../screens/EventoInfoScreen";
import NotificacionesScreen from "../screens/NotificacionesScreen"; // ← NUEVO
import LogoutScreen from "../screens/LogoutScreen";

import { AuthContext } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell"; // ← NUEVO

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Menú lateral
const DrawerNavigator = () => (
	<Drawer.Navigator initialRouteName="Home">
		<Drawer.Screen name="Home" component={HomeScreen} />
		<Drawer.Screen name="Eventos" component={EventosScreen} />
		<Drawer.Screen
			name="Cerrar Sesión"
			component={LogoutScreen}
			options={{ headerShown: false }}
		/>
	</Drawer.Navigator>
);

// Usuarios autenticados
const AuthenticatedNavigator = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Main"
			component={DrawerNavigator}
			options={{
				headerShown: true,
				title: "Inicio",
				headerRight: () => <NotificationBell />, // ← Campana
			}}
		/>
		<Stack.Screen
			name="EventoInfo"
			component={EventoInfoScreen}
			options={{ title: "Detalle del Evento" }}
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
		<Stack.Screen name="Login" component={LoginScreen} />
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
