import React from "react";
import Peer from "peerjs";
import { PEER_CONFIG } from "../env";

export default function usePeer() {
    const peer = new Peer(null, PEER_CONFIG);
    return peer;
}
