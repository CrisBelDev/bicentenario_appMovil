// src/navigation/AppNavigator.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import LogoutScreen from "../screens/LogoutScreen"; // Importa el componente de logout
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function AppNavigator() {
	const { user } = useContext(AuthContext);

	const AuthenticatedNavigator = () => (
		<Drawer.Navigator initialRouteName="Home">
			<Drawer.Screen name="Home" component={HomeScreen} />
			<Drawer.Screen
				name="Cerrar Sesión"
				component={LogoutScreen}
				options={{ headerShown: false }}
			/>
		</Drawer.Navigator>
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
