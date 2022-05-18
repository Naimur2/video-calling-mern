import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { RTCView } from "react-native-webrtc";

import { useNavigation } from "@react-navigation/native";
import useAuth from "../../hooks/use-auth";
import useLocalStream from "../../hooks/use-localStream";
import SocketContext from "./../../store/socket-context";

export default function CallScreen() {
    const socketCtx = React.useContext(SocketContext);
    const navigation = useNavigation();
    const user = useAuth();

    const localStreamUrl = socketCtx.localStream
        ? socketCtx.localStream.toURL()
        : null;
    const remoteStreamUrl = socketCtx.remoteStream
        ? socketCtx.remoteStream.toURL()
        : null;

    React.useEffect(() => {
        if (!socketCtx.localStream || !socketCtx.remoteStream) {
            navigation.goBack();
        } else {
            console.log("Both local and remote streams are ready");
            console.log("localStreamUrl: ", socketCtx.localStream);
            console.log("remoteStreamUrl: ", socketCtx.remoteStream);
        }
    }, [socketCtx.localStream, socketCtx.remoteStream]);

    const endCall = () => {
        if (socketCtx.callDetails) {
            const msz = {
                type: "END_CALL",
                data: { ...socketCtx.callDetails, user },
            };

            socketCtx.sendMessage(msz);
            socketCtx.endCall();
        }
    };

    React.useEffect(() => {
        if (!socketCtx.callDetails) {
            navigation.navigate("Dashboard");
        }
    }, [socketCtx.callDetails]);

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                {localStreamUrl ? (
                    <RTCView
                        streamURL={localStreamUrl}
                        style={styles.selfView}
                    />
                ) : null}
            </View>
            <View style={styles.remoteStream}>
                {remoteStreamUrl ? (
                    <RTCView
                        streamURL={remoteStreamUrl}
                        style={styles.remoteView}
                    />
                ) : null}
            </View>

            <Button title="End Call" onPress={endCall} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        position: "relative",
    },
    input: {
        height: 50,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: "100%",
    },
    selfView: {
        width: 150,
        height: 150,
        padding: 0,
    },
    box: {
        width: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 10,
        right: 0,
    },
    remoteView: {
        width: "100%",
        height: "100%",
        padding: 0,
    },
    remoteStream: {
        width: 200,
        height: 200,
        padding: 0,
        backgroundColor: "red",
    },
});
