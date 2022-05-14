const lib = {};

lib.randomId = () => {
    return Date.now().toString() + "-" + Math.random().toString().slice(2);
};

module.exports = lib;
