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
            showCallingModal: false,
        });
        socketCtx.sendMessage(message);
    };

    const rejectCall = () => {
        const message = {
            type: "REJECT_CALL",
            data: socketCtx.callDetails,
        };

        socketCtx.updateState({
            isAccepted: false,
            showCallingModal: false,
            callDetails: null,
        });
        socketCtx.sendMessage(message);
        InCallManager.stopRingtone();
        navigation.goBack();
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (!socketCtx.isAccepted) {
                socketCtx.sendMessage({
                    type: "NO_ANSWER",
                    data: socketCtx.callDetails,
                });

                socketCtx.updateState({
                    isAccepted: false,
                    showCallingModal: false,
                    callDetails: null,
                    callStatus: {
                        type: "missed call",
                        message: "You missed a call",
                    },
                });
                alert("You Missed a call");
                InCallManager.stopRingtone();
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [socketCtx.isAccepted]);

    React.useEffect(() => {
        if (!socketCtx.showCallingModal) {
            navigation.goBack();
        }
    }, [socketCtx.showCallingModal]);

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
