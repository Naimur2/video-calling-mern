const { sockets, activeSocket, busyNumbers } = require("../config/sockets");

const lib = {};

lib.isOnline = (_id) => {
    const filtered = Array.from(activeSocket).find(
        (ac) => ac.user.userId === _id
    );
    return filtered ? true : false;
};

lib.isBusy = (_id) => {
    const filtered = Array.from(busyNumbers).find(
        (ac) => ac.recieverId === _id || ac.callerId === _id
    );
    return filtered ? true : false;
};

lib.getSocket = (_id) => {
    const filtered = Array.from(activeSocket).find(
        (ac) => ac.user.userId === _id
    );
    return filtered ? filtered.socket : null;
};

lib.endCall = (data) => {
    const { callerId,  recieverId, userId } = data;
    // if calls end from caller side
    if (userId === callerId) {
        // remove from busy
        const filtered = Array.from(busyNumbers).find(
            (ac) => ac.recieverId === recieverId || ac.callerId === callerId
        );
        
        if (filtered) {
            busyNumbers.delete(filtered);
        }
        // send end call to reciever
        const recieverSocket = lib.getSocket(recieverId);
        if (recieverSocket) {
            recieverSocket.send(
                JSON.stringify({
                    type: "END_CLIENT_CALL",
                    data: {
                        callerId,
                        recieverId,
                    },
                })
            );
        }
    }
    // if calls end from reciever side
    else {
        // remove from busy
        const filtered = Array.from(busyNumbers).find(
            (ac) => ac.callerId === callerId
        );
        if (filtered) {
            busyNumbers.delete(filtered);
        }
        // send end call to caller
        const callerSocket = lib.getSocket(callerId);
        if (callerSocket) {
            callerSocket.send(
                JSON.stringify({
                    type: "END_CLIENT_CALL",
                    data: {
                        callerId,
                        recieverId,
                    },
                })
            );
        }
    }
};

lib.addToBusy = (data) => {
    busyNumbers.add(data);
};

module.exports = lib;
