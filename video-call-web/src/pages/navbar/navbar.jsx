import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import SocketContext from "../../store/socket-context";
import MainContext from "../../store/main-context";
import useAuth from "../../hooks/use-auth";
import React from "react";

export default function NavBar() {
    const socketCtx = React.useContext(SocketContext);
    const mainCtx = React.useContext(MainContext);

    const user = useAuth();

    const logoutUser = async () => {
        const message = {
            type: "LOGOUT",
            data: {
                userId: mainCtx.user._id,
            },
        };
        socketCtx.sendMessage(message);
        socketCtx.socket.close();
        socketCtx.peer.disconnect();
        socketCtx.peer.destroy();
        socketCtx.clearState();
        mainCtx.setUser(null);
        localStorage.removeItem("access_token");
    };

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Link to="/dashboard">Video Call</Link>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}
