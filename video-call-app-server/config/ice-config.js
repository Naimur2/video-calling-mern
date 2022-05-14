const dotenv = require('dotenv').config();
const Turn = require("node-turn");

const turnServer = new Turn({
    listeningPort: process.env.TURN_SERVER_PORT,
    listeningIps: [process.env.TURN_SERVER_IP],
    // set options
    authMech: "long-term",
    credentials: {
        username: "naimur",
        password: "naimur",
    },
    debug: (msg) => console.log("turn server error", msg),
    debugLevel: "ALL",
});

module.exports = turnServer;