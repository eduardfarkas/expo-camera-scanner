/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ImageResult } from "expo-image-manipulator/src/ImageManipulator.types";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

export type RootStackParamList = {
    Main: undefined;
    Camera: undefined;
    Zoom: undefined;
    Picture: { photos: ImageResult[] };
};

export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
    RootStackParamList,
    T
>;
