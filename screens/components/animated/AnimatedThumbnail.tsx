import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import React, { useEffect } from "react";
import { OverlayData } from "../overlay.types";

type Props = {
    overlayData: OverlayData;
    shape: {
        width: number;
        height: number;
    };
    uri: string;
    index: number;
};

const AnimatedThumbnail = ({ overlayData, shape, uri, index }: Props) => {
    const { screenHeight, screenWidth, holeWidth, holeHeight } = overlayData;

    const config = {
        duration: 500,
        easing: Easing.bezier(0.5, 0.01, 0, 1),
    };

    const viewBackground = useSharedValue("rgba(255,255,255,0.57)");

    const imageTop = useSharedValue((screenHeight * (1 - shape.height)) / 2 + 1);
    const imageLeft = useSharedValue((screenWidth * (1 - shape.width)) / 2 + 1);
    const imageWidth = useSharedValue(holeWidth - 2);
    const imageHeight = useSharedValue(holeHeight - 2);

    const viewStyleAnimated = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming(viewBackground.value, { duration: 250 }),
        };
    });

    const imageStyleAnimated = useAnimatedStyle(() => {
        return {
            top: withTiming(imageTop.value, config),
            left: withTiming(imageLeft.value, config),
            width: withTiming(imageWidth.value, config),
            height: withTiming(imageHeight.value, config),
        };
    });

    const animateView = () => {
        viewBackground.value = "transparent";
    };

    const animateImage = (index: number) => {
        imageTop.value = screenHeight - 100 + index * 5;
        imageLeft.value = index * 7;
        imageWidth.value = 100;
        imageHeight.value = holeWidth / (holeHeight / 100);
    };

    useEffect(() => {
        animateView();

        const timeout = setTimeout(() => {
            animateImage(index);
        }, 300);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <>
            <Animated.View
                style={[
                    {
                        position: "absolute",
                        zIndex: 100,
                        top: (screenHeight * (1 - shape.height)) / 2 + 1,
                        left: (screenWidth * (1 - shape.width)) / 2 + 1,
                        width: holeWidth - 2,
                        height: holeHeight - 2,
                    },
                    viewStyleAnimated,
                ]}
            ></Animated.View>
            <Animated.Image
                style={[
                    {
                        position: "absolute",
                        resizeMode: "contain",
                    },
                    imageStyleAnimated,
                ]}
                source={{ uri }}
            />
        </>
    );
};

export default AnimatedThumbnail;
