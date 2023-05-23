import { Camera, CameraType } from "expo-camera";
import Overlay from "./Overlay";
import React, { forwardRef } from "react";
import { StyleSheet } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";

type ScannerProps = {
    onTakePicture: () => void;
    onCameraReady: () => void;
    ratio: any;
    capturedImages: Array<ImageManipulator.ImageResult>;
    cameraStyle: any;
    options: {
        shape: {
            width: number;
            height: number;
        };
    };
};

const Scanner = forwardRef<Camera, ScannerProps>((props, ref) => {
    return (
        <Camera
            ref={ref}
            ratio={props.ratio}
            onCameraReady={props.onCameraReady}
            style={[styles.camera, props.cameraStyle]}
            type={CameraType.back}
        >
            <Overlay {...props} />
        </Camera>
    );
});

export default Scanner;

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
});
