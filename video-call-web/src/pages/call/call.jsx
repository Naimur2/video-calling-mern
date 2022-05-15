import React from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import useAuth from "../../hooks/use-auth";
import SocketContext from "../../store/socket-context";

export default function Call() {
    const user = useAuth();

    const local = React.useRef(null);
    const remote = React.useRef(null);
    const socketCtx = React.useContext(SocketContext);

    React.useEffect(() => {
        if (socketCtx.localStream) {
            local.current.srcObject = socketCtx.localStream;
        }
        if (socketCtx.remoteStream) {
            remote.current.srcObject = socketCtx.remoteStream;
        }
    }, [socketCtx]);

    const endCall = () => {
        if (socketCtx.callDetails) {
            const msz = {
                type: "END_CALL",
                data: { ...socketCtx.callDetails, user },
            };

            socketCtx.sendMessage(msz);
            socketCtx.endCall();
        }
    };

    const handleClose = () => {
        if (socketCtx.localStream && socketCtx.remoteStream) {
            endCall();
        }
        socketCtx.updateState({
            callStatus: null,
        });
    };

    return (
        <Modal
            show={socketCtx.callStatus}
            onHide={handleClose}
            backdrop="static"
            fullscreen={true}
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>{socketCtx.callStatus.message}</Modal.Title>
            </Modal.Header>
            <Row style={{ padding: "2rem" }}>
                <div style={{ width: "48%" }}>
                    {socketCtx.localStream && (
                        <video
                            style={{ width: "100%", height: "400px" }}
                            autoPlay
                            playsInline
                            ref={local}
                        ></video>
                    )}
                </div>
                <div style={{ width: "48%" }}>
                    {socketCtx.remoteStream && (
                        <video
                            style={{
                                width: "100%",
                                height: "400px",
                                transform: "rotate(90deg)",
                            }}
                            autoPlay
                            playsInline
                            ref={remote}
                        ></video>
                    )}
                </div>
            </Row>
            <Modal.Footer>
                {socketCtx.remoteStream && socketCtx.localStream && (
                    <Button onClick={endCall} variant="secondary" type="button">
                        End Call
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}
