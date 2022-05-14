import React from "react";

export default function useLocalStream() {
    const getStream = async () => {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: 1280, height: 720 },
        });

        return mediaStream;
    };

    const stopStream = (stream) => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
    };

    return [getStream, stopStream];
}
