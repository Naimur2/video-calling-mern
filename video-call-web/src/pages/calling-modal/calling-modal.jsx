import React from "react";
import { Button, Modal } from "react-bootstrap";
import SocketContext from "../../store/socket-context";

export default function CallingModal() {
    const socketCtx = React.useContext(SocketContext);

    const acceptCall = async () => {
        const { caller, callerId, reciever, recieverId, callerPeerId } =
            socketCtx.callDetails;
        const message = {
            type: "ACCEPT_CALL",
            data: {
                caller,
                callerId,
                reciever,
                recieverId,
                callerPeerId,
                recieverPeerId: socketCtx.peerId,
            },
        };

        socketCtx.setCallDetails(socketCtx.callDetails);
        socketCtx.sendMessage(message);
        socketCtx.setShowCallingModal(false);
    };

    const rejectCall = () => {
        const { caller, callerId, reciever, recieverId } =
            socketCtx.callDetails;

        const message = {
            type: "REJECT_CALL",
            data: {
                caller,
                callerId,
                reciever,
                recieverId,
            },
        };
        socketCtx.sendMessage(message);
        socketCtx.setShowCallingModal(false);
        socketCtx.setCallDetails(null);
    };

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
