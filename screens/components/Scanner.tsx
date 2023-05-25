import { Camera, CameraType } from "expo-camera";
import Overlay from "./Overlay";
import React, { forwardRef } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import CircleButton from "./CircleButton";

type ScannerProps = {
  onTakePicture: () => void;
  onCameraReady: () => void;
  ratio: any;
  capturedImages: Array<ImageManipulator.ImageResult>;
  cameraStyle: any;
  options: {
    shape: {
      width: number;
      height: number;
    };
  };
};

const BUTTON_SIZE = 70;

const Scanner = forwardRef<Camera, ScannerProps>((props, ref) => {
  return (
    <Camera
      ref={ref}
      ratio={props.ratio}
      onCameraReady={props.onCameraReady}
      style={[styles.camera, props.cameraStyle]}
      type={CameraType.back}
    >
      <Overlay {...props} />
      <TouchableOpacity
        onPress={() => console.log("ahoj")}
        style={{
          width: 80,
          height: 80,
          position: "absolute",
          bottom: 30,
          left: 20,
        }}
      ></TouchableOpacity>
      <View style={styles.button}>
        <CircleButton size={BUTTON_SIZE} onPress={props.onTakePicture} />
      </View>
    </Camera>
  );
});

export default Scanner;

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  button: {
    position: "absolute",
    bottom: 30,
    left: Dimensions.get("screen").width / 2 - BUTTON_SIZE / 2,
    zIndex: 100,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
