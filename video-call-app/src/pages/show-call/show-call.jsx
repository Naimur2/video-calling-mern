import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, StyleSheet, View } from "react-native";
import InCallManager from "react-native-incall-manager";
import SocketContext from "./../../store/socket-context";

export default function ShowCall() {
    const { container } = styles;

    const socketCtx = React.useContext(SocketContext);
    const navigation = useNavigation();

    const acceptCall = async () => {
        const message = {
            type: "ACCEPT_CALL",
            data: {
                ...socketCtx.callDetails,
                recieverPeerId: socketCtx.peerId,
            },
        };

        // socketCtx.setCallDetails(socketCtx.callDetails);
        socketCtx.updateState({
            isAccepted: true,
        });
        socketCtx.sendMessage(message);
        socketCtx.setShowCallingModal(false);
    };

    const rejectCall = () => {
        const message = {
            type: "REJECT_CALL",
            data: socketCtx.callDetails,
        };
        socketCtx.updateState({
            isAccepted: false,
        });
        socketCtx.sendMessage(message);
        socketCtx.setShowCallingModal(false);
        socketCtx.setCallDetails(null);
        InCallManager.stopRingtone();
        navigation.goBack();
    };

    React.useEffect(() => {
        if (socketCtx.notAnswered) {
            alert("notAnswered");

            navigation.goBack();
            socketCtx.updateState({
                notAnswered: false,
            });
            socketCtx.setShowCallingModal(false);
            socketCtx.setCallDetails(null);
        }
    }, [socketCtx.notAnswered]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (!socketCtx.isAccepted) {
                alert(JSON.stringify(socketCtx.callDetails));
                // socketCtx.setShowCallingModal(false);
                // socketCtx.setCallDetails(null);
                socketCtx.sendMessage({
                    type: "NO_ANSWER",
                    data: socketCtx.callDetails,
                });
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [socketCtx.isAccepted]);

    return (
        <View style={container}>
            <View style={styles.btn}>
                <Button title="Answer" onPress={acceptCall} />
            </View>
            <View style={styles.btn}>
                <Button title="Reject" onPress={rejectCall} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    btn: {
        width: "100%",
        height: 50,
        marginTop: 20,
    },
});
