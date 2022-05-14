/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import useLocalStream from "../../hooks/use-localStream";
import Call from "../call/call";
import SocketContext from "./../../store/socket-context";

export default function Dashboard() {
    const socketCtx = React.useContext(SocketContext);
    const [getStream, stopStream] = useLocalStream();
    const peer = socketCtx.peer;

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

    return (
        <>
            <Call />
        </>
    );
}
