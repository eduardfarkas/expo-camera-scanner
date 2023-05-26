import { Button, Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import { RootScreenProps } from "../navigation/types";
import { Camera } from "expo-camera";
import React, { useRef, useState } from "react";
import Scanner from "./scanner/components/Scanner";
import * as ImageManipulator from "expo-image-manipulator";
import { SaveFormat } from "expo-image-manipulator";

export default function CameraScreen({ navigation }: RootScreenProps<"Camera">) {
    const [permission, requestPermission] = Camera.useCameraPermissions();

    const [images, setImages] = useState<Array<ImageManipulator.ImageResult>>([]);

    // Screen Ratio and image padding
    const [imagePadding, setImagePadding] = useState(0);
    const [ratio, setRatio] = useState("4:3"); // default is 4:3
    const { width, height } = Dimensions.get("window");
    const screenRatio = height / width;
    const [isRatioSet, setIsRatioSet] = useState(false);

    const cameraRef = useRef<Camera>(null);
    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const cutoutWidth = 0.8;
    const cutoutHeight = 0.7;

    function handleTakePicture() {
        if (!cameraRef.current) return;

        cameraRef.current.takePictureAsync({}).then((data) => {
            ImageManipulator.manipulateAsync(
                data.uri,
                [
                    {
                        crop: {
                            originX: data.width * ((1 - cutoutWidth) / 2),
                            originY: data.height * ((1 - cutoutHeight) / 2),
                            height: data.height * cutoutHeight,
                            width: data.width * cutoutWidth,
                        },
                    },
                ],
                {
                    compress: 0.8,
                    format: SaveFormat.JPEG,
                }
            ).then((croppedData) => {
                setImages((prevState) => [...prevState, croppedData]);
            });
        });
    }

    const prepareRatio = async () => {
        let desiredRatio = "4:3"; // Start with the system default
        // This issue only affects Android
        if (Platform.OS === "android") {
            if (!cameraRef.current) return;

            const ratios = await cameraRef.current.getSupportedRatiosAsync();

            let distances = new Map<string, number>();
            let realRatios = new Map<string, number>();

            for (const ratio of ratios) {
                const parts = ratio.split(":");
                const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
                realRatios.set(ratio, realRatio);

                const distance = screenRatio - realRatio;
                distances.set(ratio, distance);
            }

            let smallestValue = Infinity;
            let smallestDistanceKey = "";

            for (const [key, value] of distances) {
                if (value > 0 && value < smallestValue) {
                    smallestValue = value;
                    smallestDistanceKey = key;
                }
            }

            desiredRatio = smallestDistanceKey;

            //  calculate the difference between the camera width and the screen height
            const padding = Math.floor((height - (realRatios.get(desiredRatio) ?? 0) * width) / 2);

            setImagePadding(padding);
            setRatio(desiredRatio);

            setIsRatioSet(true);
        }
    };

    // the camera must be loaded in order to access the supported ratios
    const setCameraReady = async () => {
        if (!isRatioSet) {
            await prepareRatio();
        }
    };

    return (
        <View style={styles.container}>
            <Scanner
                options={{ shape: { height: cutoutHeight, width: cutoutWidth } }}
                ref={cameraRef}
                ratio={ratio}
                cameraStyle={{ marginTop: imagePadding, marginBottom: imagePadding }}
                onTakePicture={handleTakePicture}
                onCameraReady={setCameraReady}
                capturedImages={images}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
});
