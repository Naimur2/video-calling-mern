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
        const { caller, callerId, reciever, recieverId, callerPeerId } =
            socketCtx.callDetails;

        const message = {
            type: "ACCEPT_CALL",
            data: {
                caller,
                callerId,
                reciever,
                recieverId,
                callerPeerId,
                recieverPeerId: socketCtx.peerId,
            },
        };

        socketCtx.sendMessage(message);
        socketCtx.setShowCallingModal(false);
    };

    const rejectCall = () => {
        const { caller, callerId, reciever, recieverId } =
            socketCtx.callDetails;

        const message = {
            type: "REJECT_CALL",
            data: {
                caller,
                callerId,
                reciever,
                recieverId,
            },
        };
        socketCtx.sendMessage(message);
        socketCtx.setShowCallingModal(false);
        socketCtx.setCallDetails(null);
        InCallManager.stopRingtone();
        navigation.goBack();
    };

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
