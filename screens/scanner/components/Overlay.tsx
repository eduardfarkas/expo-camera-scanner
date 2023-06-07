import { View } from "react-native";
import Svg from "react-native-svg";
import React, { useContext } from "react";
import ScreenOverlayWithHolePath from "./svg/ScreenOverlayWithHolePath";
import InnerRectPath from "./svg/InnerRectPath";
import { ScannerContext } from "../scannerContext";

type Props = {};

const Overlay = ({}: Props) => {
    const scannerContext = useContext(ScannerContext);

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <Svg
                style={{
                    width: scannerContext.overlayData.screenWidth,
                    height: scannerContext.overlayData.screenHeight,
                }}
            >
                <ScreenOverlayWithHolePath overlayData={scannerContext.overlayData} />
                <InnerRectPath overlayData={scannerContext.overlayData} />
            </Svg>
        </View>
    );
};

export default Overlay;
