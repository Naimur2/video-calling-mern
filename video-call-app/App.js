import React from "react";
import Route from "./src";
import MainContexProvider from "./src/store/MainContexProvider";
import SocketProvider from "./src/store/SocketProvider";

export default function App() {
  

    return (
        <MainContexProvider>
            <SocketProvider>
                <Route />
            </SocketProvider>
        </MainContexProvider>
    );
}
