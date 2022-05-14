import React from "react";
import { Button, Modal } from "react-bootstrap";
import SocketContext from "../../store/socket-context";

export default function CallingModal() {
    const socketCtx = React.useContext(SocketContext);

    const acceptCall = async () => {
        const message = {
            type: "ACCEPT_CALL",
            data: {
                ...socketCtx.callDetails,
                recieverPeerId: socketCtx.peerId,
            },
        };
        socketCtx.updateState({
            isAccepted: true,
        });
        // socketCtx.setCallDetails(socketCtx.callDetails);
        socketCtx.sendMessage(message);
        socketCtx.setShowCallingModal(false);
    };

    const rejectCall = () => {
        const message = {
            type: "REJECT_CALL",
            data: socketCtx.callDetails,
        };
        socketCtx.updateState({
            isAccepted: false,
        });
        socketCtx.sendMessage(message);
        socketCtx.setShowCallingModal(false);
        socketCtx.setCallDetails(null);
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (!socketCtx.isAccepted) {
                alert(JSON.stringify(socketCtx.callDetails));
                socketCtx.sendMessage({
                    type: "NO_ANSWER",
                    data: socketCtx.callDetails,
                });
                // socketCtx.setCallDetails(null);
                // socketCtx.setShowCallingModal(false);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [socketCtx.isAccepted]);

    React.useEffect(() => {
        if (socketCtx.notAnswered) {
            alert("notAnswered");
            socketCtx.updateState({
                notAnswered: false,
            });
            socketCtx.setShowCallingModal(false);
            socketCtx.setCallDetails(null);
        }
    }, [socketCtx.notAnswered]);

    return (
        <Modal
            show={socketCtx.showCallingModal}
            onHide={rejectCall}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    You have a call from {socketCtx.callDetails.caller}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                I will not close if you click outside me. Don't even try to
                press escape key.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={acceptCall}>
                    Accept
                </Button>
                <Button onClick={rejectCall} variant="primary">
                    Reject
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
