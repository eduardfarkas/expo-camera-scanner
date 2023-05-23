import { Path } from "react-native-svg";
import React from "react";
import { OverlayData } from "../overlay.types";

type Props = {
    overlayData: OverlayData;
};

const ScreenOverlayWithHolePath = ({ overlayData }: Props) => {
    const { holeOffsetX, holeOffsetY, holeWidth, holeHeight, screenWidth, screenHeight } = overlayData;

    const pathData = `
    M 0 0
    L ${screenWidth} 0
    L ${screenWidth} ${screenHeight}
    L 0 ${screenHeight}
    L 0 0
    M ${holeOffsetX} ${holeOffsetY}
    L ${holeOffsetX + holeWidth} ${holeOffsetY}
    L ${holeOffsetX + holeWidth} ${holeOffsetY + holeHeight}
    L ${holeOffsetX} ${holeOffsetY + holeHeight}
    L ${holeOffsetX} ${holeOffsetY}
  `;

    return <Path d={pathData} fill={"rgba(10, 10, 10, 0.5)"} fillRule="evenodd" />;
};

export default ScreenOverlayWithHolePath;
