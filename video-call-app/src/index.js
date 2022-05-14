import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import useAuth from "./hooks/use-auth";
import CallScreen from "./pages/call-screen/call-screen";
import Dashboard from "./pages/dashboard/dashboard";
import Login from "./pages/login/login";
import ShowCall from "./pages/show-call/show-call";
import MainContext from "./store/main-context";
import SocketContext from "./store/socket-context";
const Stack = createNativeStackNavigator();

export default function Route() {
    const mainCtx = React.useContext(MainContext);
    const socketCtx = React.useContext(SocketContext);

    const user = useAuth();

    React.useEffect(() => {
        if (user) {
            socketCtx.setSocket(user);
            socketCtx.setPeer();
        }
    }, [user]);

    React.useEffect(() => {
        mainCtx.validate();
    }, []);

    return (
        <>
            {user ? (
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Dashboard">
                        <Stack.Screen name="Dashboard" component={Dashboard} />
                        <Stack.Screen name="Call" component={CallScreen} />
                        <Stack.Screen name="ShowCall" component={ShowCall} />
                    </Stack.Navigator>
                </NavigationContainer>
            ) : (
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Login">
                        <Stack.Screen name="Login" component={Login} />
                    </Stack.Navigator>
                </NavigationContainer>
            )}
        </>
    );
}
