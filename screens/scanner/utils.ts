import * as ImageManipulator from "expo-image-manipulator";
import { SaveFormat } from "expo-image-manipulator";
import { Dimensions, Platform } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { ImageResult } from "expo-image-manipulator/src/ImageManipulator.types";
import { OVERLAY, Ratio } from "./scanner.constants";
import { PhotoFile } from "react-native-vision-camera";
import { OverlayData } from "./components/overlay.types";

export const getOverlayDimensions = (ratio: Ratio, insets: EdgeInsets) => {
    const _screenHeight = Dimensions.get("screen").height;
    const _windowHeight = Dimensions.get("window").height;
    const navbarHeight = _screenHeight - _windowHeight - insets.top;

    const screenWidth = Math.ceil(Dimensions.get("screen").width);
    const screenHeight = _screenHeight - (Platform.OS === "android" ? navbarHeight : 0);

    const availableWidth = screenWidth - OVERLAY.PADDING_HORIZONTAL;
    const availableHeight = screenHeight - OVERLAY.PADDING_VERTICAL;
    let holeWidth: number;
    let holeHeight: number;

    const availableAspectRatio = availableWidth / availableHeight;

    if (availableAspectRatio > ratio.ratio) {
        holeWidth = availableHeight * ratio.ratio;
        holeHeight = availableHeight;
    } else {
        holeWidth = availableWidth;
        holeHeight = availableWidth / ratio.ratio;
    }

    return {
        screenWidth: screenWidth,
        screenHeight: screenHeight,
        holeWidth: holeWidth,
        holeHeight: holeHeight,
        holeOffsetX: (availableWidth - holeWidth) / 2 + OVERLAY.PADDING_HORIZONTAL / 2,
        holeOffsetY:
            (availableHeight - holeHeight) / 2 +
            OVERLAY.PADDING_VERTICAL / 2 -
            OVERLAY.PADDING_VERTICAL / 4,
    };
};

export const handleCrop = ({
    uri,
    overlayData,
    photo,
    snapshot,
    onCropped,
    onCroppedSnapshot,
}: {
    uri: string;
    overlayData: OverlayData;
    snapshot?: PhotoFile;
    photo?: PhotoFile;
    onCropped?: (photo: ImageResult) => void;
    onCroppedSnapshot?: (snapshot: ImageResult) => void;
}) => {
    let _photoHeight = 0;
    let _photoWidth = 0;
    if (photo) {
        // některé telefony mají otočenou výšku/šířku
        _photoHeight = photo.metadata.Orientation === 6 ? photo.width : photo.height;
        _photoWidth = photo.metadata.Orientation === 6 ? photo.height : photo.width;
    }
    if (snapshot) {
        _photoHeight = snapshot.height;
        _photoWidth = snapshot.width;
    }

    const ratioHoleToScreenHeight = overlayData.holeHeight / overlayData.screenHeight;
    const ratioHoleToScreenWidth = overlayData.holeWidth / overlayData.screenWidth;

    const ratioScreenPixelToPhotoPixel = _photoHeight / overlayData.screenHeight;
    const displayedPhotoPixelsWidth = ratioScreenPixelToPhotoPixel * overlayData.screenWidth;

    const notDisplayedPhotoPixelsWidth = _photoWidth - displayedPhotoPixelsWidth;

    const originX =
        (notDisplayedPhotoPixelsWidth + (1 - ratioHoleToScreenWidth) * displayedPhotoPixelsWidth) /
        2;
    const originY =
        (_photoHeight * (1 - ratioHoleToScreenHeight)) / 2 -
        (OVERLAY.PADDING_VERTICAL / 4) * ratioScreenPixelToPhotoPixel;
    const height = _photoHeight * ratioHoleToScreenHeight;
    const width = displayedPhotoPixelsWidth * ratioHoleToScreenWidth;

    ImageManipulator.manipulateAsync(
        uri,
        [
            {
                crop: {
                    originX,
                    originY,
                    height,
                    width,
                },
            },
        ],
        {
            compress: 1,
            format: SaveFormat.JPEG,
        }
    ).then((croppedPhoto) => {
        onCropped && onCropped(croppedPhoto);
        onCroppedSnapshot && onCroppedSnapshot(croppedPhoto);
    });
};
