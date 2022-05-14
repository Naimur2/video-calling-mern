const ctrl = {};

ctrl.connection = (connection) => {
    console.log("new peer client connected", connection.id);
};

ctrl.disconnect = (client) => {
    console.log("disconnecd peer client", client.id);
};

ctrl.error = (error) => {
    console.log("error", error);
};



module.exports = ctrl;
