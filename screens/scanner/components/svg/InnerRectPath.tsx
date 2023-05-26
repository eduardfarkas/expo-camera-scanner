import { Rect } from "react-native-svg";
import React from "react";
import { OverlayData } from "../overlay.types";

type Props = {
  overlayData: OverlayData;
};

const InnerRectPath = ({ overlayData }: Props) => {
  const { holeOffsetX, holeOffsetY, holeWidth, holeHeight } = overlayData;

  return (
    <Rect
      x={holeOffsetX}
      y={holeOffsetY}
      stroke={"rgb(64,142,189)"}
      strokeWidth={2}
      width={holeWidth}
      height={holeHeight}
    />
  );
};

export default InnerRectPath;
