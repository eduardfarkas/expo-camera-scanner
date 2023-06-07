import { Camera } from "react-native-vision-camera";
import { Linking } from "react-native";

export const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === "denied") await Linking.openSettings();
};
