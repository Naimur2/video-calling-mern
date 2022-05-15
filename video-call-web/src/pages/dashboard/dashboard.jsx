/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import useAuth from "../../hooks/use-auth";
import useLocalStream from "../../hooks/use-localStream";
import SocketContext from "./../../store/socket-context";

export default function Dashboard() {
    const socketCtx = React.useContext(SocketContext);
    const [getStream, stopStream] = useLocalStream();
    const peer = socketCtx.peer;

    const [friendsId, setFriendsId] = React.useState("");
    const user = useAuth();

    const callToUser = (e) => {
        e.preventDefault();
        if (!friendsId || friendsId.length < 11) {
            alert("Please enter your friend's friendsId number");
            return;
        }
        const callerId = user._id;
        const caller = user.phone;
        const recieverId = "gdfgfdgfdgfdgfd";
        const reciever = friendsId;
        const callerPeerId = socketCtx.peerId;
        const data = { callerId, caller, recieverId, reciever, callerPeerId };
        socketCtx.setCallDetails(data);

        socketCtx.callToUser(data);
    };

    React.useEffect(() => {
        const peerConnection = () => {
            peer.on("open", (id) => {
                socketCtx.setPeerId(id);
                console.log("peer id: ", id);
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

    React.useEffect(() => {
        if (socketCtx.isEndCall) {
            if (socketCtx.localStream) {
                stopStream(socketCtx.localStream);
                socketCtx.setLocalStream(null);
            }

            if (socketCtx.remoteStream) {
                socketCtx.setRemoteStream(null);
            }
            socketCtx.setIsEndCall(false);
        }
    }, [socketCtx.isEndCall]);

    React.useEffect(() => {
        if (socketCtx.localStream && socketCtx.remoteStream) {
            socketCtx.updateState({
                callStatus: {
                    type: "started video",
                    message: "You are in a call",
                },
            });
        }
    }, [socketCtx.localStream, socketCtx.remoteStream]);

    // React.useEffect(() => {
    //     if (socketCtx.notAnswered) {
    //         socketCtx.updateState({
    //             notAnswered: false,
    //         });
    //         socketCtx.setShowCallingModal(false);
    //         socketCtx.setCallDetails(null);
    //     }
    // }, [socketCtx.notAnswered]);

    return (
        <Container className="mt-4">
            <h1>Call a Friend</h1>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Enter phone Number</Form.Label>
                    <Form.Control
                        value={friendsId}
                        onChange={(e) => setFriendsId(e.target.value)}
                        type="telephone"
                        placeholder="Enter phone number"
                    />
                </Form.Group>
                <Button onClick={callToUser} variant="primary" type="submit">
                    Call
                </Button>
            </Form>
        </Container>
    );
}
