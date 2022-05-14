const { randomId } = require("../lib/random-id");
const { sockets, activeSocket, busyNumbers } = require("../data/sockets");

const ctrl = {};

ctrl.addSocket = (socket) => {
    sockets.add(socket);
    console.log("sockets", sockets.size);
};

ctrl.removeSocket = (socketObj) => {
    sockets.delete(socketObj);
    const data = JSON.stringify(socketObj);

    const activeSocketArrray = Array.from(activeSocket);

    const filtered = activeSocketArrray.findIndex(
        (ac) => JSON.stringify(ac.socket) === data
    );

    if (filtered !== -1) {
        const activeSocketObj = activeSocketArrray[filtered];
        activeSocket.delete(activeSocketObj);
    }

    const busyNumbersArray = Array.from(busyNumbers);

    const isACaller = busyNumbersArray.findIndex(
        (ac) => JSON.stringify(ac.callerSocket) === JSON.stringify(socketObj)
    );
    console.log("isACaller", isACaller);

    
    const isAReciever = busyNumbersArray.findIndex(
        (ac) => JSON.stringify(ac.recieverSocket) === JSON.stringify(socketObj)
    );
    
    console.log("isAReciever", isAReciever);

    if (isACaller !== -1) {
        const busyNumberObj = busyNumbersArray[isACaller];
        const recieverSocket = busyNumberObj.recieverSocket;
        recieverSocket.send(
            JSON.stringify({
                type: "END_CLIENT_CALL",
                data: {
                    caller: busyNumberObj.caller,
                    callerId: busyNumberObj.callerId,
                    reciever: busyNumberObj.reciever,
                    recieverId: busyNumberObj.recieverId,
                },
            })
        );
        busyNumbers.delete(busyNumberObj);
    }


    if (isAReciever !== -1) {
        console.log("isAReciever");
        const busyNumberObj = busyNumbersArray[isAReciever];
        const callerSocket = busyNumberObj.callerSocket;

        callerSocket.send(
            JSON.stringify({
                type: "END_CLIENT_CALL",
                data: {
                    caller: busyNumberObj.caller,
                    callerId: busyNumberObj.callerId,
                    reciever: busyNumberObj.reciever,
                    recieverId: busyNumberObj.recieverId,
                },
            })
        );
        busyNumbers.delete(busyNumberObj);
    }

    console.log("sockets", sockets.size);
    console.log("activeSocket", activeSocket.size);
    console.log("busyNumbers", busyNumbers.size);
};

ctrl.setUser = (socket, data) => {
    const socketObj = {
        id: randomId(),
        socket,
        user: data,
    };
    console.log("user", socketObj.user.phone);
    activeSocket.add(socketObj);
    console.log("activeSocket", activeSocket.size);
};

ctrl.sendMessage = (socket, data) => {
    const { message, from, to } = data;
    const filtered = Array.from(activeSocket).find(
        (ac) => ac.user.phone === to.phone
    );
    filtered.socket.send(
        JSON.stringify({
            type: "MESSAGE",
            data: {
                message,
                from,
                to,
            },
        })
    );
    socket.send(
        JSON.stringify({
            type: "MESSAGE",
            data: {
                message: "sent",
                from,
                to,
            },
        })
    );
};

ctrl.callToUser = (socket, data) => {
    const { callerId, caller, recieverId, reciever, callerPeerId } = data;

    const filteredActive = Array.from(busyNumbers).find(
        (d) => d.reciever === reciever || d.caller === reciever
    );
    const filtered = Array.from(activeSocket).filter(
        (ac) => ac.user.phone === reciever
    );

    if (filtered && filtered.length > 0 && !filteredActive) {
        filtered.forEach((item) => {
            item.socket.send(
                JSON.stringify({
                    type: "CALL_REQUEST",
                    data: {
                        callerId,
                        caller,
                        recieverId,
                        reciever,
                        callerPeerId,
                    },
                })
            );
        });
    } else {
        if (filteredActive) {
            socket.send(
                JSON.stringify({
                    type: "BUSY",
                    data: {
                        callerId,
                        caller,
                        recieverId,
                        reciever,
                    },
                })
            );
        } else {
            socket.send(
                JSON.stringify({
                    type: "NOT_AVAILABLE",
                    data: {
                        callerId,
                        caller,
                        recieverId,
                        reciever,
                    },
                })
            );
        }
    }
};

ctrl.endCall = (soc, data) => {
    const busyNumbersArray = Array.from(busyNumbers);

    const isACaller = busyNumbersArray.findIndex(
        (ac) => JSON.stringify(ac.callerSocket) === JSON.stringify(soc)
    );
    const isAReciever = busyNumbersArray.findIndex(
        (ac) => JSON.stringify(ac.recieverSocket) === JSON.stringify(soc)
    );

    console.log("isAReciever", isAReciever);
    console.log("isACaller", isACaller);

    if (isACaller !== -1) {
        const busyNumberObj = busyNumbersArray[isACaller];
        const recieverSocket = busyNumberObj.recieverSocket;
        recieverSocket.send(
            JSON.stringify({
                type: "END_CLIENT_CALL",
                data,
            })
        );
        busyNumbers.delete(busyNumberObj);
    }

    if (isAReciever !== -1) {
        console.log("isAReciever");
        const busyNumberObj = busyNumbersArray[isAReciever];
        const callerSocket = busyNumberObj.callerSocket;

        callerSocket.send(
            JSON.stringify({
                type: "END_CLIENT_CALL",
                data,
            })
        );
        busyNumbers.delete(busyNumberObj);
    }

    console.log("busyNumbers", busyNumbers.size);
};

ctrl.endClientCall = (socket, data) => {
    console.log("end call", data);
    const { callerId, caller, recieverId, reciever } = data;
    const filtered = Array.from(activeSocket).find(
        (ac) => ac.user.phone === caller
    );
    const filteredActive = Array.from(busyNumbers).find(
        (d) => d.reciever === reciever || d.caller === reciever
    );

    if (filteredActive) {
        busyNumbers.delete(filteredActive);
    }

    if (filtered) {
        filtered.socket.send(
            JSON.stringify({
                type: "END_CLIENT_CALL",
                data: {
                    callerId,
                    caller,
                    recieverId,
                    reciever,
                },
            })
        );
    } else {
        socket.send(
            JSON.stringify({
                type: "NOT_AVAILABLE",
                data: {
                    callerId,
                    caller,
                    recieverId,
                    reciever,
                },
            })
        );
    }
};

ctrl.rejectCall = (socket, data) => {
    console.warn("reject call", data);
    const { callerId, caller, recieverId, reciever } = data;
    const filtered = Array.from(activeSocket).find(
        (ac) => ac.user.phone === caller
    );

    if (filtered) {
        filtered.socket.send(
            JSON.stringify({
                type: "REJECT_CALL",
                data: {
                    callerId,
                    caller,
                    recieverId,
                    reciever,
                },
            })
        );
    } else {
        socket.send(
            JSON.stringify({
                type: "NOT_AVAILABLE",
                data: {
                    callerId,
                    caller,
                    recieverId,
                    reciever,
                },
            })
        );
    }
};

ctrl.acceptCall = async (socket, data) => {
    console.log("accept call", data);

    const filtered = Array.from(activeSocket).find(
        (ac) => ac.user.phone === data.caller
    );
    // send recievers data to caller
    if (filtered) {
        busyNumbers.add({
            ...data,
            recieverSocket: socket,
            callerSocket: filtered.socket,
        });
        await filtered.socket.send(
            JSON.stringify({
                type: "ANSWER_RECEIVER_CALL",
                data,
            })
        );
    } else {
        await socket.send(
            JSON.stringify({
                type: "CALL_ENDED",
                data,
            })
        );
    }
};

ctrl.answerCall = async (socket, data) => {
    console.log("answer call", data);

    const filtered = Array.from(activeSocket).find(
        (ac) => ac.user.phone === data.reciever
    );
    // send recievers data to caller
    if (filtered) {
        await filtered.socket.send(
            JSON.stringify({
                type: "ANSWER_CLIENT_CALL",
                data,
            })
        );
    } else {
        console.log("not found");
        await socket.send(
            JSON.stringify({
                type: "CALL_ENDED",
                data,
            })
        );
    }
};

// ctrl.logout = (socket, data) => {
//     const filtered = Array.from(activeSocket).find(
//         (ac) => ac.user.userId === data.userId
//     );

//     if (filtered) {
//         activeSocket.delete(filtered);
//         const userSocket = JSON.stringify(filtered.socket);
//         console.log("ok");

//         const filteredSocket = Array.from(sockets).find(
//             (ac) => JSON.stringify(ac) === userSocket
//         );
//         if (filteredSocket) {
//             sockets.delete(filteredSocket);
//         }
//     }
// };

ctrl.notAccept = (socket, data) => {
    console.warn("not accepted", data);
    const { callerId, caller, recieverId, reciever } = data;
    const filtered = Array.from(activeSocket).find(
        (ac) => ac.user.phone === caller
    );

    if (filtered) {
        filtered.socket.send(
            JSON.stringify({
                type: "NOT_ANSWERED",
                data: {
                    callerId,
                    caller,
                    recieverId,
                    reciever,
                },
            })
        );
    } else {
        socket.send(
            JSON.stringify({
                type: "NOT_AVAILABLE",
                data: {
                    callerId,
                    caller,
                    recieverId,
                    reciever,
                },
            })
        );
    }
};

module.exports = ctrl;
