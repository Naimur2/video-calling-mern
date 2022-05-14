import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import SocketContext from "../../store/socket-context";
import MainContext from "../../store/main-context";
import useAuth from "../../hooks/use-auth";
import React from "react";

export default function NavBar() {
    const socketCtx = React.useContext(SocketContext);
    const mainCtx = React.useContext(MainContext);
    const navigate = useNavigate();

    const user = useAuth();

    const logoutUser = async () => {
        // if (socketCtx.callDetails) {
        //     const msz = {
        //         type: "END_CALL",
        //         data: { ...socketCtx.callDetails, user },
        //     };

        //     socketCtx.sendMessage(msz);
        //     socketCtx.endCall();
        // }
        const message = {
            type: "LOGOUT",
            data: {
                userId: mainCtx.user.phone,
            },
        };
        socketCtx.sendMessage(message);
        socketCtx.socket.close();
        socketCtx.peer.disconnect();
        socketCtx.peer.destroy();
        socketCtx.clearState();
        mainCtx.logout();
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Link to="/dashboard">Video Call</Link>
                </Navbar.Brand>

                <Nav>
                    {user && (
                        <Nav.Item>
                            <Button onClick={logoutUser}>Logout</Button>
                        </Nav.Item>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}
