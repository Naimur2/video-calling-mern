const iceConfig = require("./ice-config");
const websocket = require("./websocket-config");

const confg = {
    iceServers: iceConfig,
    websocket,
};

module.exports = confg;
