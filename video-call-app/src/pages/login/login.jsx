import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { DATA_URL } from "../../../env";
import MainContext from "../../store/main-context";
import SocketContext from "./../../store/socket-context";
import useAuth from "../../hooks/use-auth";

export default function Login() {
    const { container } = styles;
    const [phone, setPhone] = React.useState("");
    const [password, setPassword] = React.useState("");

    const mainCtx = React.useContext(MainContext);

    const handleChange = (value, type) => {
        if (type === "phone") setPhone(value);
        else if (type === "password") setPassword(value);
    };

    const handleSubmit = async () => {
        // try {
        const formData = {
            phone,
            password,
        };
        mainCtx.login(formData);
    };

    return (
        <View style={container}>
            <View style={styles.inputgroup}>
                <Text>Phone</Text>
                <TextInput
                    onChangeText={(value) => handleChange(value, "phone")}
                    placeholder="Insert your username"
                    style={styles.input}
                />
            </View>

            <View style={styles.inputgroup}>
                <Text>Password</Text>
                <TextInput
                    onChangeText={(value) => handleChange(value, "password")}
                    placeholder="Insert your password"
                    style={styles.input}
                />
            </View>
            <Button
                style={styles.button}
                onPress={handleSubmit}
                title="Login"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        width: "90%",
        height: 50,
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
    },
    inputgroup: {
        width: "80%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    button: {
        width: "90%",
        height: 50,
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
    },
});
