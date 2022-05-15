import React from "react";
import { mediaDevices } from "react-native-webrtc";

export default function useLocalStream() {
    const getStream = async () => {
        try {
            let isFront = true;
            const facing = isFront ? "front" : "environment";

            const sourceInfos = await mediaDevices.enumerateDevices();

            let videoSourceId;
            for (let sourceInfo of sourceInfos) {
                if (
                    sourceInfo.kind === "videoinput" &&
                    sourceInfo.facing === facing
                ) {
                    videoSourceId = sourceInfo.deviceId;
                }
            }

            const constraints = {
                audio: true,
                video: {
                    width: 1280,
                    height: 720,
                    frameRate: 30,
                    facingMode: isFront ? "user" : "environment",
                    deviceId: videoSourceId,
                },
            };

            const stream = await mediaDevices.getUserMedia(constraints);
            return stream;
        } catch (error) {
            console.warn(error);

            return null;
        }
    };

    const stopStream = (stream) => {
        stream.getTracks().forEach((track) => {
            track.stop();
        });
    };

    return [getStream, stopStream];
}
