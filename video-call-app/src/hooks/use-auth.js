import React from "react";
import MainContext from "../store/main-context";

export default function useAuth() {
    const mainCtx = React.useContext(MainContext);
  

    return mainCtx.user ? mainCtx.user : null;
}
