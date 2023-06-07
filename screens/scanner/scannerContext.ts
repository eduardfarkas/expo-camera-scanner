import { createContext } from "react";
import { Ratio, RATIOS } from "./scanner.constants";
import { OverlayData } from "./components/overlay.types";

export type ScannerContextType = {
    ratio: Ratio;
    overlayData: OverlayData;
};

const initialOverlayData = {
    screenWidth: 0,
    screenHeight: 0,
    holeWidth: 0,
    holeHeight: 0,
    holeOffsetX: 0,
    holeOffsetY: 0,
};

export const ScannerContext = createContext<ScannerContextType>({
    ratio: RATIOS.A4,
    overlayData: initialOverlayData,
});
