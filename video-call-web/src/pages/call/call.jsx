import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import useAuth from "../../hooks/use-auth";
import useLocalStream from "../../hooks/use-localStream";
import MainContext from "../../store/main-context";
import SocketContext from "../../store/socket-context";

export default function Call() {
    const mainCtx = React.useContext(MainContext);
    const socketCtx = React.useContext(SocketContext);
    const [message, setMessage] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [getStream, stopStream] = useLocalStream();
    const user = useAuth();

    const local = React.useRef(null);
    const remote = React.useRef(null);

    const [friendsId, setFriendsId] = React.useState("");

    React.useEffect(() => {
        if (socketCtx.localStream) {
            local.current.srcObject = socketCtx.localStream;
        }
        if (socketCtx.remoteStream) {
            remote.current.srcObject = socketCtx.remoteStream;
        }
    }, [socketCtx]);

    const callUser = (e) => {
        e.preventDefault();
        if (!friendsId || friendsId.length < 11) {
            alert("Please enter your friend's friendsId number");
            return;
        }
        const callerId = mainCtx.user._id;
        const caller = mainCtx.user.phone;
        const recieverId = "gdfgfdgfdgfdgfd";
        const reciever = friendsId;
        const callerPeerId = socketCtx.peerId;
        const data = { callerId, caller, recieverId, reciever, callerPeerId };
        socketCtx.setCallDetails(data);

        socketCtx.callToUser(data);
    };

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

    const sendMessage = (e) => {
        const from = { _id: mainCtx.user._id, phone: mainCtx.user.phone };
        e.preventDefault();
        if (message.length < 1) {
            alert("Please enter your message");
            return;
        }
        if (phone.length < 1) {
            alert("Please enter your phone number");
            return;
        }
        socketCtx.sendMessage({
            type: "MESSAGE",
            data: { from, to: { phone }, message },
        });
    };

    return (
        <Container className="mt-4">
            <h1>Call a Friend</h1>
            {socketCtx.peerId && <p>{socketCtx.peerId}</p>}
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Enter phone Number</Form.Label>
                    <Form.Control
                        value={friendsId}
                        onChange={(e) => setFriendsId(e.target.value)}
                        type="telephone"
                        placeholder="Enter phone number"
                    />
                </Form.Group>
                <Button onClick={callUser} variant="primary" type="submit">
                    Call
                </Button>
                <Button onClick={endCall} variant="secondary" type="button">
                    End Call
                </Button>
                {/* <Button onClick={closeCall} variant="primary" type="button">
                    Stop Call
                </Button> */}
            </Form>
            <Form className="my-4">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="telephone"
                        placeholder="Enter phone"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="message">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        placeholder="Enter message"
                        required
                    />
                </Form.Group>
                <Button onClick={sendMessage} variant="primary" type="submit">
                    Send
                </Button>
            </Form>

            {socketCtx.localStream && (
                <video
                    style={{ width: "100vw", height: "50vh" }}
                    autoPlay
                    playsInline
                    ref={local}
                ></video>
            )}
            {socketCtx.remoteStream && (
                <video
                    style={{ width: "100vw", height: "50vh" }}
                    autoPlay
                    playsInline
                    ref={remote}
                ></video>
            )}
        </Container>
    );
}
