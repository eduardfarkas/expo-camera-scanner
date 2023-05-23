import { Rect } from "react-native-svg";
import React, { useEffect } from "react";
import { OverlayData } from "../overlay.types";
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";

type Props = {
    overlayData: OverlayData;
    capturedImages: any[];
};

const AnimatedSquare = Animated.createAnimatedComponent(Rect);

const InnerHolePath = ({ overlayData, capturedImages }: Props) => {
    const { holeOffsetX, holeOffsetY, holeWidth, holeHeight } = overlayData;

    const config = {
        duration: 100,
        easing: Easing.bezier(0.5, 0.01, 0, 1),
    };

    const fillColor = useSharedValue("transparent");

    const animatedProps = useAnimatedProps(() => {
        return {
            fill: withTiming(fillColor.value, config, () => {
                fillColor.value = "transparent";
            }),
        };
    });

    const animateFlash = () => {
        fillColor.value = "rgba(255,255,255,0.37)";
    };

    useEffect(() => {
        if (capturedImages.length === 0) return;

        animateFlash();
    }, [capturedImages.length]);

    const innerSquarePathData = `
    M ${holeOffsetX} ${holeOffsetY}
    L ${holeOffsetX + holeWidth} ${holeOffsetY}
    L ${holeOffsetX + holeWidth} ${holeOffsetY + holeHeight}
    L ${holeOffsetX} ${holeOffsetY + holeHeight}
    L ${holeOffsetX} ${holeOffsetY}
  `;

    return (
        // <Path
        //     d={innerSquarePathData}
        //     //fill="transparent"
        //     style={colorStyleAnimated}
        //     stroke={"rgb(64,142,189)"}
        //     strokeWidth={2}
        // />
        <AnimatedSquare
            animatedProps={animatedProps}
            x={holeOffsetX}
            y={holeOffsetY}
            stroke={"rgb(64,142,189)"}
            strokeWidth={2}
            width={holeWidth}
            height={holeHeight}
        />
    );
};

export default InnerHolePath;
