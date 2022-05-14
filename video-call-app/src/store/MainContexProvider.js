import React from "react";
import { DATA_URL } from "../../env";
import MainContext from "./main-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultState = {
    user: null,
    error: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.user,
            };

        case "LOGOUT":
            return {
                ...state,
                user: null,
            };

        case "SET_ERROR":
            return {
                ...state,
                error: action.error,
            };

        default:
            return state;
    }
};

export default function MainContexProvider({ children }) {
    const [mainReducer, dispatch] = React.useReducer(reducer, defaultState);

    const validateToken = async () => {
        const token = await AsyncStorage.getItem("token");
        console.log(token);

        if (!token) return;
        try {
            const response = await fetch(`${DATA_URL}/user/validate`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status !== 200) {
                AsyncStorage.removeItem("token");
                dispatch({
                    type: "SET_ERROR",
                    error: {
                        type: "login",
                        message: "Authentication failed",
                    },
                });
            } else {
                const data = await response.json();
                dispatch({
                    type: "SET_USER",
                    user: data.user,
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogin = async (user) => {
        try {
            const response = await fetch(`${DATA_URL}/user/login`, {
                method: "POST",
                body: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                alert("Invalid phone or password");
                dispatch({
                    type: "SET_ERROR",
                    error: {
                        type: "login",
                        message: "Invalid phone or password",
                    },
                });
            } else {
                const data = await response.json();
                await AsyncStorage.setItem("token", data.token);
                dispatch({ type: "SET_USER", user: data.user });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const value = {
        user: mainReducer.user,
        login: handleLogin,
        logout: () => dispatch({ type: "LOGOUT" }),
        validate: () => validateToken(),
        error: mainReducer.error,
        setError: (error) => dispatch({ type: "SET_ERROR", error }),
    };

    return (
        <MainContext.Provider value={value}>{children}</MainContext.Provider>
    );
}
