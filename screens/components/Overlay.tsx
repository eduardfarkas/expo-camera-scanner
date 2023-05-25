import { Dimensions, View } from "react-native";
import Svg from "react-native-svg";
import React from "react";
import * as ImageManipulator from "expo-image-manipulator";
import ScreenOverlayWithHolePath from "./svg/ScreenOverlayWithHolePath";
import InnerRectPath from "./svg/InnerRectPath";
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

  return (
    <View style={{ flex: 1 }}>
      <Svg style={{ width: screenWidth, height: screenHeight }}>
        <ScreenOverlayWithHolePath overlayData={overlayData} />
        <InnerRectPath overlayData={overlayData} />
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
