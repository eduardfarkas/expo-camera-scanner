import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg from "react-native-svg";
import React from "react";
import * as ImageManipulator from "expo-image-manipulator";
import ScreenOverlayWithHolePath from "./svg/ScreenOverlayWithHolePath";
import InnerHolePath from "./svg/InnerHolePath";
import { OverlayData } from "./overlay.types";
import AnimatedThumbnail from "./animated/AnimatedThumbnail";

type Props = {
    onTakePicture: () => void;
    capturedImages: Array<ImageManipulator.ImageResult>;
    options: {
        shape: {
            width: number;
            height: number;
        };
    };
};

const Overlay = ({ onTakePicture, capturedImages, options }: Props) => {
    const { shape } = options;

    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const holeWidth = screenWidth * shape.width;
    const holeHeight = screenHeight * shape.height;

    const overlayData: OverlayData = {
        screenWidth,
        screenHeight,
        holeWidth: screenWidth * shape.width,
        holeHeight: screenHeight * shape.height,
        holeOffsetX: (screenWidth - holeWidth) / 2,
        holeOffsetY: (screenHeight - holeHeight) / 2,
    };

    const handleImageCapture = () => {
        onTakePicture();
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleImageCapture}>
                    <Text style={styles.text}>Take picture</Text>
                </TouchableOpacity>
            </View>
            <Svg style={{ width: screenWidth, height: screenHeight }}>
                <ScreenOverlayWithHolePath overlayData={overlayData} />
                <InnerHolePath capturedImages={capturedImages} overlayData={overlayData} />
            </Svg>
            {capturedImages.length > 0 &&
                capturedImages.map((image, index) => {
                    return (
                        <AnimatedThumbnail
                            key={index}
                            index={index % 5}
                            uri={image.uri}
                            overlayData={overlayData}
                            shape={shape}
                        />
                    );
                })}
        </View>
    );
};

export default Overlay;

const styles = StyleSheet.create({
    buttonContainer: {
        position: "absolute",
        bottom: 30,
        flexDirection: "row",
        backgroundColor: "transparent",
        margin: 20,
        zIndex: 100,
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
