import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import InCallManager from "react-native-incall-manager";
import useLocalStream from "../../hooks/use-localStream";
import MainContext from "../../store/main-context";
import SocketContext from "./../../store/socket-context";

export default function Dashboard() {
    const mainCtx = React.useContext(MainContext);
    const [getStream, stopStream] = useLocalStream();

    const [friendsId, setFriendsId] = React.useState("");

    const navigation = useNavigation();

    const socketCtx = React.useContext(SocketContext);
    const peer = socketCtx.peer;

    React.useEffect(() => {
        const peerConnection = () => {
            peer.on("open", (id) => {
                socketCtx.setPeerId(id);
                console.log("My peer ID is: " + id);
            });

            peer.on("connection", (connection) => {
                connection.on("data", (data) => {
                    console.log("received data:", data);
                });
            });

            peer.on("close", function () {
                console.log("Connection destroyed");
            });

            peer.on("error", (e) => {
                console.log("peer error", e.message);
            });

            peer.on("disconnected", function () {
                console.log("Connection lost. Please reconnect");
            });

            peer.on("call", async (call) => {
                const stream = await getStream();
                socketCtx.setLocalStream(stream);
                call.answer(stream); // Answer the call with an A/V stream.
                call.on("stream", function (remoteStream) {
                    socketCtx.setRemoteStream(remoteStream);
                });

                call.on("close", function () {
                    // socketCtx.setIsEndCall(true);
                    // alert("call closed");
                });
            });
        };
        if (peer) peerConnection();

        let clean = false;
        return () => {
            clean = true;
        };
    }, [peer]);

    const callToFriend = () => {
        if (!friendsId || friendsId.length < 11) {
            alert("Please enter your friend's id");
            return;
        }

        const callerId = mainCtx.user._id;
        const caller = mainCtx.user.phone;
        const recieverId = "gdfgfdgfdgfdgfd";
        const reciever = friendsId;
        const callerPeerId = socketCtx.peerId;
        const data = { callerId, caller, recieverId, reciever, callerPeerId };
        socketCtx.setCallDetails(data);
        socketCtx.callToUser(data);
    };

    React.useEffect(() => {
        if (socketCtx.callDetails && socketCtx.showCallingModal) {
            InCallManager.startRingtone("_DEFAULT_");
            navigation.navigate("ShowCall");
        }
    }, [socketCtx]);

    React.useEffect(() => {
        if (socketCtx.localStream && socketCtx.remoteStream) {
            // when user pickup
            InCallManager.stopRingtone();
            InCallManager.start({
                media: "video",
            });
            InCallManager.setForceSpeakerphoneOn(true);
            navigation.navigate("Call");
        }
    }, [socketCtx.localStream, socketCtx.remoteStream]);

    React.useEffect(() => {
        if (socketCtx.isEndCall) {
            if (socketCtx.localStream) {
                stopStream(socketCtx.localStream);
                InCallManager.setForceSpeakerphoneOn(false);
                InCallManager.stop();
                socketCtx.setLocalStream(null);
            }

            if (socketCtx.remoteStream) {
                socketCtx.setRemoteStream(null);
            }

            socketCtx.setIsEndCall(false);
        }
    }, [socketCtx.isEndCall]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter friends user id"
                value={friendsId}
                onChangeText={(value) => setFriendsId(value)}
            />
            <Button title="Connect" onPress={callToFriend} />
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
    code: {
        fontSize: 16,
        fontWeight: "bold",
        margin: 10,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
    },
    welcome: {
        fontSize: 18,
        textAlign: "center",
        margin: 10,
    },
});
