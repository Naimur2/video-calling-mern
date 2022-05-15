import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import useAuth from "./hooks/use-auth";
import NotFound from "./pages/404";
import CallingModal from "./pages/calling-modal/calling-modal";
import Dashboard from "./pages/dashboard/dashboard";
import Login from "./pages/login/login";
import NavBar from "./pages/navbar/navbar";
import PrivateRoute from "./pages/private-route";
import Register from "./pages/register/register";
import MainContext from "./store/main-context";
import SocketContext from "./store/socket-context";
import Call from "./pages/call/call";

export default function App() {
    const socketCtx = React.useContext(SocketContext);
    const mainCtx = React.useContext(MainContext);

    const auth = useAuth();

    React.useEffect(() => {
        mainCtx.validate();
    }, []);

    return (
        <>
            {socketCtx.callStatus && <Call />}
            {socketCtx.callDetails && socketCtx.showCallingModal && (
                <CallingModal />
            )}
            <NavBar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute />}>
                    <Route path="/dashboard/" element={<Dashboard />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}
