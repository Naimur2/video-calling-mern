import React from "react";

const MainContext = React.createContext({
    user: null,
    login: () => {},
    logout: () => {},
    validate: () => {},
    error: null,
    setError: () => {},
});

export default MainContext;
