// src/navigation/AppNavigator.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import EventosScreen from "../screens/EventosScreen";
import EventoInfoScreen from "../screens/EventoInfoScreen"; // ← Pantalla detalle
import LogoutScreen from "../screens/LogoutScreen";

import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Este es tu menú lateral (Drawer)
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

export default function AppNavigator() {
	const { user } = useContext(AuthContext);

	const AuthenticatedNavigator = () => (
		<Stack.Navigator>
			{/* Drawer completo como pantalla principal */}
			<Stack.Screen
				name="Main"
				component={DrawerNavigator}
				options={{ headerShown: false }}
			/>
			{/* Pantalla de detalles del evento */}
			<Stack.Screen
				name="EventoInfo"
				component={EventoInfoScreen}
				options={{ title: "Detalle del Evento" }}
			/>
		</Stack.Navigator>
	);

	const UnauthenticatedNavigator = () => (
		<Stack.Navigator initialRouteName="Login">
			<Stack.Screen name="Login" component={LoginScreen} />
		</Stack.Navigator>
	);

	return (
		<NavigationContainer>
			{user ? <AuthenticatedNavigator /> : <UnauthenticatedNavigator />}
		</NavigationContainer>
	);
}
