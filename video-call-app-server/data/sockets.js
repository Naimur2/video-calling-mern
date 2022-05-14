const sockets = new Set();
const activeSocket = new Set();
const busyNumbers = new Set();

module.exports = {
    sockets,
    activeSocket,
    busyNumbers,
};
