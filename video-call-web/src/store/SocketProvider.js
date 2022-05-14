import Peer from "peerjs";
import React from "react";
import { PEER_CONFIG, WEB_SOCKET } from "../env";
import useLocalStream from "../hooks/use-localStream";
import SocketContext from "./socket-context";

const defaultState = {
    socket: null,
    message: null,
    callDetails: null,
    showCallingModal: false,
    localStream: null,
    remoteStream: null,
    peerId: null,
    peer: null,
    isBusy: false,
    isRejected: false,
    isEndCall: null,
    notFound: false,
    localCall: null,
    notAvailable: false,
    notAnswered: false,
};

const socketReducerer = (state, action) => {
    switch (action.type) {
        case "SET_SOCKET":
            return {
                ...state,
                socket: action.socket,
            };
        case "SET_MESSAGE":
            return {
                ...state,
                message: action.message,
            };
        case "SET_CALL_DETAILS":
            return {
                ...state,
                callDetails: action.callDetails,
            };
        case "SET_SHOW_CALLING_MODAL":
            return {
                ...state,
                showCallingModal: action.showCallingModal,
            };
        case "SET_LOCAL_STREAM":
            return {
                ...state,
                localStream: action.localStream,
            };
        case "SET_REMOTE_STREAM":
            return {
                ...state,
                remoteStream: action.remoteStream,
            };
        case "SET_PEER_ID":
            return {
                ...state,
                peerId: action.peerId,
            };
        case "SET_PEER":
            return {
                ...state,
                peer: action.peer,
            };
        case "SET_IS_BUSY":
            return {
                ...state,
                isBusy: action.isBusy,
            };
        case "SET_IS_REJECTED":
            return {
                ...state,
                isRejected: action.isRejected,
            };
        case "SET_IS_END_CALL":
            return {
                ...state,
                isEndCall: action.isEndCall,
            };

        case "SET_LOCAL_CALL":
            return {
                ...state,
                localCall: action.localCall,
            };
        case "SET_NOT_ANSWERED":
            return {
                ...state,
                notAnswered: action.notAnswered,
            };

        case "SET_LOCAL_STREAM_INFO":
            return {
                ...state,
                localStream: action.payload.localStream,
                isEndCall: action.payload.isEndCall,
                localCall: action.payload.localCall,
            };

        case "SET_REMOTE_STREAM_INFO":
            return {
                ...state,
                remoteStream: action.payload.remoteStream,
                isEndCall: action.payload.isEndCall,
                localCall: action.payload.localCall,
            };

        case "SET_NOT_AVAILABLE":
            return {
                ...state,
                notAvailable: action.notAvailable,
            };
        case "UPDATE_STATE":
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export default function SocketProvider({ children }) {
    const [state, dispatch] = React.useReducer(socketReducerer, defaultState);
    const [getStream, stopStream] = useLocalStream();

    const localPeer = React.useRef(null);
    const locCall = React.useRef(null);

    const answerCall = React.useCallback(
        async (peerId) => {
            try {
                const stream = await getStream();
                const call = await localPeer.current.call(peerId, stream);
                console.log("call", call);
                locCall.current = call;

                dispatch({
                    type: "SET_LOCAL_STREAM_INFO",
                    payload: {
                        localStream: stream,
                        isEndCall: false,
                        localCall: call,
                    },
                });

                call.on("stream", (remoteStream) => {
                    dispatch({
                        type: "SET_REMOTE_STREAM",
                        remoteStream,
                    });
                });

                call.on("close", () => {
                    dispatch({
                        type: "UPDATE_STATE",
                        payload: {
                            remoteStream: null,
                            isEndCall: true,
                        },
                    });
                });
            } catch (err) {
                console.log(err);
            }
        },
        [localPeer]
    );

    const value = React.useMemo(() => {
        const setPeer = () => {
            const peer = new Peer(null, PEER_CONFIG);
            localPeer.current = peer;
            dispatch({
                type: "SET_PEER",
                peer,
            });
        };

        const sendMessage = async (message) => {
            console.log(message.type, message);
            const mssg = JSON.stringify(message);

            if (state.socket) {
                await state.socket.send(mssg);
            }
        };

        const onRejectCall = (call) => {
            if (locCall.current) {
                locCall.current.close();
                locCall.current = null;
            }

            dispatch({
                type: "UPDATE_STATE",
                payload: {
                    isEndCall: false,
                    localCall: null,
                    localStream: null,
                    remoteStream: null,
                    isBusy: false,
                    isRejected: true,
                    notFound: false,
                    notAvailable: false,
                    showCallingModal: false,
                    callDetails: null,
                    notAnswered: false,
                },
            });

            alert("Call Rejected");
        };

        const onBusy = (call) => {
            if (locCall.current) {
                locCall.current.close();
                locCall.current = null;
            }

            dispatch({
                type: "UPDATE_STATE",
                payload: {
                    isEndCall: false,
                    localCall: null,
                    localStream: null,
                    remoteStream: null,
                    isBusy: true,
                    isRejected: false,
                    notFound: false,
                    notAvailable: false,
                    showCallingModal: false,
                    callDetails: null,
                    notAnswered: false,
                },
            });

            alert("User is busy");
        };
        const onNotAnswered = (call) => {
            if (locCall.current) {
                locCall.current.close();
                locCall.current = null;
            }

            dispatch({
                type: "UPDATE_STATE",
                payload: {
                    isEndCall: false,
                    localCall: null,
                    localStream: null,
                    remoteStream: null,
                    isBusy: false,
                    isRejected: false,
                    notFound: false,
                    notAvailable: false,
                    showCallingModal: false,
                    callDetails: null,
                    notAnswered: true,
                },
            });

            alert("User is busy");
        };

        const onNotAvailable = (call) => {
            if (locCall.current) {
                locCall.current.close();
                locCall.current = null;
            }

            dispatch({
                type: "UPDATE_STATE",
                payload: {
                    isEndCall: false,
                    localCall: null,
                    localStream: null,
                    remoteStream: null,
                    isBusy: false,
                    isRejected: false,
                    notFound: false,
                    notAvailable: true,
                    showCallingModal: false,
                    callDetails: null,
                    notAnswered: false,
                },
            });

            alert("User is not available");
        };

        const onCallRequest = async (data) => {
            dispatch({
                type: "UPDATE_STATE",
                payload: {
                    showCallingModal: true,
                    callDetails: data,
                },
            });
        };

        const onEndCall = async (data) => {
            if (locCall.current) {
                await locCall.current.close();
                locCall.current = null;
            }
            const message = {
                type: "END_CALL",
                data,
            };
            await sendMessage(message);

            dispatch({
                type: "UPDATE_STATE",
                payload: {
                    isEndCall: true,
                    localCall: null,
                    remoteStream: null,
                    isBusy: false,
                    isRejected: false,
                    notFound: false,
                    notAvailable: false,
                    showCallingModal: false,
                    callDetails: null,
                    notAnswered: false,
                },
            });
        };

        const setMessage = (message) => {
            dispatch({
                type: "SET_MESSAGE",
                message,
            });
        };

        const setSocket = (user) => {
            const socket = new WebSocket(WEB_SOCKET);
            socket.onopen = () => {
                socket.send(
                    JSON.stringify({
                        type: "SET_USER",
                        data: { userId: user._id, phone: user.phone },
                    })
                );
                dispatch({
                    type: "SET_SOCKET",
                    socket,
                });
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case "SET_MESSAGE":
                        setMessage(data);
                        break;
                    case "ANSWER_CLIENT_CALL":
                        answerCall(
                            data.data.callerPeerId,
                            socket,
                            "callerPeerId"
                        );
                        break;
                    case "ANSWER_RECEIVER_CALL":
                        answerCall(data.data.recieverPeerId);
                        break;
                    // case "END_CALL":
                    //     socket.send(
                    //         JSON.stringify({
                    //             type: "END_CLIENT_CALL",
                    //             data: data.data,
                    //         })
                    //     );
                    //     endCall(data.data, socket);
                    //     break;
                    case "END_CLIENT_CALL":
                        onEndCall(data.data);
                        break;
                    case "REJECT_CALL":
                        onRejectCall(data.data);
                        break;
                    case "CALL_REQUEST":
                        onCallRequest(data.data);
                        break;
                    case "BUSY":
                        onBusy(data.data);
                        break;
                    case "NOT_AVAILABLE":
                        // show modal
                        onNotAvailable(data.data);
                        break;
                    case "NOT_ANSWERED":
                        // show modal
                        onNotAnswered(data.data);
                        break;
                    default:
                        break;
                }
            };

            socket.onclose = () => {
                dispatch({
                    type: "SET_SOCKET",
                    socket: null,
                });
            };
        };

        const callToUser = async (data) => {
            const message = {
                type: "CALL_TO_USER",
                data,
            };
            await sendMessage(message);
        };

        return {
            socket: state.socket,
            message: state.message,
            setSocket: setSocket,
            sendMessage: sendMessage,
            setMessage: (message) => dispatch({ type: "SET_MESSAGE", message }),
            callToUser: callToUser,
            endCall: onEndCall,
            callDetails: state.callDetails,
            setCallDetails: (callDetails) =>
                dispatch({ type: "SET_CALL_DETAILS", callDetails }),
            showCallingModal: state.showCallingModal,
            setShowCallingModal: (showCallingModal) =>
                dispatch({ type: "SET_SHOW_CALLING_MODAL", showCallingModal }),
            localStream: state.localStream,
            setLocalStream: (localStream) =>
                dispatch({ type: "SET_LOCAL_STREAM", localStream }),
            remoteStream: state.remoteStream,
            setRemoteStream: (remoteStream) =>
                dispatch({ type: "SET_REMOTE_STREAM", remoteStream }),
            peerId: state.peerId,
            setPeerId: (peerId) => dispatch({ type: "SET_PEER_ID", peerId }),
            peer: state.peer,
            setPeer,
            isRejected: state.isRejected,
            setIsRejected: (isRejected) =>
                dispatch({ type: "SET_IS_REJECTED", isRejected }),
            isEndCall: state.isEndCall,
            setIsEndCall: (isEndCall) =>
                dispatch({ type: "SET_IS_END_CALL", isEndCall }),
            isBusy: state.isBusy,
            setIsBusy: (isBusy) => dispatch({ type: "SET_IS_BUSY", isBusy }),
            notFound: state.notFound,

            localCall: state.localCall,
            setLocalCall: (localCall) =>
                dispatch({ type: "SET_LOCAL_CALL", localCall }),
            notAvailable: state.notAvailable,
            setNotAvailable: (notAvailable) =>
                dispatch({ type: "SET_NOT_AVAILABLE", notAvailable }),
            setRemoteStreamInfo: (remoteStreamInfo) =>
                dispatch({
                    type: "SET_REMOTE_STREAM_INFO",
                    payload: remoteStreamInfo,
                }),
            setLocalStreamInfo: (localStreamInfo) =>
                dispatch({
                    type: "SET_LOCAL_STREAM_INFO",
                    payload: localStreamInfo,
                }),
            updateState: (data) =>
                dispatch({ type: "UPDATE_STATE", payload: data }),
            notAnswered: state.notAnswered,
            setNotAnswered: (notAnswered) =>
                dispatch({ type: "SET_NOT_ANSWERED", notAnswered }),
        };
    }, [state, answerCall]);

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}
