import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Circle, Svg } from "react-native-svg";
import React, { useCallback, useContext, useMemo } from "react";
import { Camera, TakePhotoOptions, TakeSnapshotOptions } from "react-native-vision-camera";
import { ScannerContext } from "../scannerContext";
import { ImageResult } from "expo-image-manipulator/src/ImageManipulator.types";
import { handleCrop } from "../utils";

type Props = {
    camera: React.RefObject<Camera>;
    onPhotoCaptured: (photo: ImageResult) => void;
    onSnapshotCaptured: (snapshot: ImageResult) => void;
    flash: "off" | "on";
    size: number;
};

const STROKE_WIDTH = 5;

const CaptureButton = ({ onPhotoCaptured, onSnapshotCaptured, size, camera, flash }: Props) => {
    const INNER_CIRCLE_SIZE = size - STROKE_WIDTH * 2 - 4;
    const RADIUS = (size - STROKE_WIDTH) / 2;
    const { overlayData } = useContext(ScannerContext);

    const captureMediaOptions = useMemo<TakePhotoOptions & TakeSnapshotOptions>(
        () => ({
            photoCodec: "jpeg",
            qualityPrioritization: "speed",
            flash: flash,
            quality: 90,
            skipMetadata: false,
        }),
        [flash]
    );

    const captureMedia = useCallback(() => {
        try {
            if (camera.current == null) throw new Error("Camera ref is null!");

            camera.current.takePhoto(captureMediaOptions).then((photo) => {
                // console.log("photo", JSON.stringify(photo, null, 2));

                handleCrop({
                    uri: `file://${photo.path}`,
                    overlayData,
                    photo,
                    onCropped: onPhotoCaptured,
                });
            });

            Platform.OS === "android" &&
                camera.current.takeSnapshot(captureMediaOptions).then((snapshot) => {
                    // console.log("snapshot", JSON.stringify(snapshot, null, 2));

                    handleCrop({
                        uri: `file://${snapshot.path}`,
                        overlayData,
                        snapshot,
                        onCroppedSnapshot: onSnapshotCaptured,
                    });
                });
        } catch (e) {
            console.error("Failed to take photo!", e);
        }
    }, [camera.current, onPhotoCaptured, onSnapshotCaptured, overlayData, captureMediaOptions]);

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <TouchableOpacity style={styles.innerCircleContainer} onPress={captureMedia}>
                <View
                    style={[
                        styles.innerCircle,
                        {
                            width: INNER_CIRCLE_SIZE,
                            height: INNER_CIRCLE_SIZE,
                            borderRadius: INNER_CIRCLE_SIZE / 2,
                        },
                    ]}
                />
            </TouchableOpacity>

            <View style={[styles.outerCircle, { width: size, height: size }]}>
                <Svg width={size} height={size}>
                    <Circle
                        cx={RADIUS + STROKE_WIDTH / 2}
                        cy={RADIUS + STROKE_WIDTH / 2}
                        r={RADIUS}
                        fill="transparent"
                        strokeWidth={STROKE_WIDTH}
                        stroke="white"
                    />
                </Svg>
            </View>
        </View>
    );
};

export default CaptureButton;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    outerCircle: {
        position: "absolute",
    },
    innerCircleContainer: {
        zIndex: 100,
    },
    innerCircle: {
        backgroundColor: "white",
    },
});
