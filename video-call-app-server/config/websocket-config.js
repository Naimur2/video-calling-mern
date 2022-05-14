const WebSocket = require("ws");
const websocketCtrl = require("../controllers/websocket-controller");
const { randomId } = require("../lib/random-id");
const dotenv = require("dotenv").config();

const websocket = new WebSocket.Server({
    port: process.env.SOCKET_PORT,
});

websocket.on("connection", (socket) => {
    websocketCtrl.addSocket(socket);

    socket.on("message", (msg) => {
        const socketData = JSON.parse(msg);

        const { type, data } = socketData;

        switch (type) {
            case "SET_USER":
                console.log("SET_USER", data);
                websocketCtrl.setUser(socket, data);
                break;
            case "MESSAGE":
                websocketCtrl.sendMessage(socket, data);
                break;
            case "CALL_TO_USER":
                websocketCtrl.callToUser(socket, data);
                break;
            case "END_CALL":
                // console.log("END_CALL", data);
                websocketCtrl.endCall(socket, data);
                break;
            case "END_CLIENT_CALL":
                websocketCtrl.endClientCall(socket, data);
                break;
            case "REJECT_CALL":
                websocketCtrl.rejectCall(socket, data);
                break;
            case "ACCEPT_CALL":
                websocketCtrl.acceptCall(socket, data);
                break;
            case "ANSWER_CLIENT_CALL":
                websocketCtrl.answerCall(socket, data);
                break;
            case "LOGOUT":
                websocketCtrl.removeSocket(socket);
                break;
            case "NO_ANSWER":
                websocketCtrl.notAccept(socket, data);
                break;
            default:
                console.log("unknown type", type);
                console.log("unknown socket message type");
                break;
        }
    });

    socket.onclose = (e) => {
        websocketCtrl.removeSocket(socket);
    };

    socket.on("error", (err) => {
        console.log("websocket error: " + err);
    });
});

module.exports = websocket;
