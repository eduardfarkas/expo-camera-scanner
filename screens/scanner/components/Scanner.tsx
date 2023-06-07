import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { requestCameraPermission } from "../permissions/cameraPermissions";
import CaptureButton from "./CaptureButton";
import IonIcon from "@expo/vector-icons/Ionicons";
import Overlay from "./Overlay";
import { ScannerContext, ScannerContextType } from "../scannerContext";
import { Ratio, RATIOS } from "../scanner.constants";
import { getOverlayDimensions } from "../utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImageResult } from "expo-image-manipulator/src/ImageManipulator.types";
import RatioIcon from "./RatioIcon";
import Thumbnail from "./animated/Thumbnail";
import { useIsFocused } from "@react-navigation/native";
import { useIsForeground } from "../hooks/useIsForeground";

type Props = {
    onSave: (photos: ImageResult[]) => void;
    onClose: () => void;
};

const THUMBNAIL_SIZE = 60;
const CAPTURE_BUTTON_SIZE = 80;
const FLASH_BUTTON_SIZE = 40;
const CONTENT_SPACING = 15;

const Scanner = ({ onSave, onClose }: Props) => {
    // check if camera page is active
    const isFocussed = useIsFocused();
    const isForeground = useIsForeground();
    const isActive = isFocussed && isForeground;

    const [photos, setPhotos] = useState<ImageResult[]>([]);
    const [snapshots, setSnapshots] = useState<ImageResult[]>([]);

    const [currentRatio, setCurrentRatio] = useState<Ratio>(RATIOS.ratio_a4);
    const insets = useSafeAreaInsets(); // lze nahradit constantami react-native-static-safe-area

    const scannerContext = useMemo<ScannerContextType>(
        () => ({
            ratio: currentRatio,
            overlayData: getOverlayDimensions(currentRatio, insets),
        }),
        [currentRatio, insets]
    );

    const [flash, setFlash] = useState<"off" | "on">("off");

    const camera = useRef<Camera>(null);

    const devices = useCameraDevices();
    const device = devices["back"];

    const supportsFlash = device?.hasFlash ?? false;

    useEffect(() => {
        requestCameraPermission();
    }, []);

    const onFlashPressed = useCallback(() => {
        setFlash((f) => (f === "off" ? "on" : "off"));
    }, []);

    const onPhotoCaptured = useCallback((photo: ImageResult) => {
        setPhotos((prevState) => [...prevState, photo]);
    }, []);

    const onSnapshotCaptured = useCallback((snapshot: ImageResult) => {
        setSnapshots((prevState) => [...prevState, snapshot]);
    }, []);

    const handleSave = () => {
        onSave(photos);
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <ScannerContext.Provider value={scannerContext}>
            <View style={styles.container}>
                {device && (
                    <Camera
                        ref={camera}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        photo
                        isActive={isActive}
                        preset="photo"
                        orientation="portrait"
                    />
                )}

                <Overlay />

                <View style={styles.photo}>
                    {Platform.OS === "ios" &&
                        photos &&
                        photos.map((photo, index) => (
                            <View key={index} style={{ position: "absolute" }}>
                                <Thumbnail uri={photo.uri} />
                            </View>
                        ))}
                    {Platform.OS === "android" &&
                        snapshots &&
                        snapshots.map((snapshot, index) => (
                            <View key={index} style={{ position: "absolute" }}>
                                <Thumbnail uri={snapshot.uri} />
                            </View>
                        ))}
                </View>

                <ScrollView
                    alwaysBounceHorizontal={false}
                    horizontal
                    contentContainerStyle={styles.ratiosContent}
                    style={styles.ratios}
                >
                    {Object.entries(RATIOS).map(([key, value]) => (
                        <TouchableOpacity key={key} onPress={() => setCurrentRatio(value)}>
                            <RatioIcon
                                size={30}
                                ratio={value}
                                active={currentRatio.ratio === value.ratio}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.captureButton}>
                    <CaptureButton
                        size={CAPTURE_BUTTON_SIZE}
                        camera={camera}
                        flash={supportsFlash ? flash : "off"}
                        onPhotoCaptured={onPhotoCaptured}
                        onSnapshotCaptured={onSnapshotCaptured}
                    />
                </View>

                <View style={styles.saveButton}>
                    <Button
                        onPress={handleSave}
                        title={`Save (${Platform.OS === "ios" ? photos.length : snapshots.length})`}
                    />
                </View>

                <View style={styles.rightButtonRow}>
                    <TouchableOpacity style={styles.button} onPress={handleClose}>
                        <IonIcon name="close" color="white" size={24} />
                    </TouchableOpacity>
                    {supportsFlash && (
                        <TouchableOpacity style={styles.button} onPress={onFlashPressed}>
                            <IonIcon
                                name={flash === "on" ? "flash" : "flash-off"}
                                color="white"
                                size={24}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ScannerContext.Provider>
    );
};

export default Scanner;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    photo: {
        position: "absolute",
        left: 30,
        bottom: 30 + CAPTURE_BUTTON_SIZE / 2 - THUMBNAIL_SIZE / 2,
        width: THUMBNAIL_SIZE,
        height: THUMBNAIL_SIZE,
    },
    captureButton: {
        position: "absolute",
        alignSelf: "center",
        bottom: 30,
    },
    saveButton: {
        position: "absolute",
        right: 30,
        height: 40,
        bottom: CAPTURE_BUTTON_SIZE / 2 - 20 + 30,
    },
    rightButtonRow: {
        position: "absolute",
        right: 10,
        top: 40,
    },
    button: {
        marginBottom: CONTENT_SPACING,
        width: FLASH_BUTTON_SIZE,
        height: FLASH_BUTTON_SIZE,
        borderRadius: FLASH_BUTTON_SIZE / 2,
        backgroundColor: "rgba(140, 140, 140, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    ratios: {
        position: "absolute",
        alignSelf: "center",
        height: 60,
        bottom: 50 + CAPTURE_BUTTON_SIZE,
    },
    ratiosContent: {
        justifyContent: "center",
        alignItems: "center",
    },
});
