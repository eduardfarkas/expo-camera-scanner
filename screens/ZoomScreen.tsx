import { Dimensions, StyleSheet, Text } from "react-native";
import { RootScreenProps } from "../navigation/types";
import React, { useRef } from "react";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

export default function ZoomScreen({ navigation }: RootScreenProps<"Zoom">) {
  const doubleTapRef = useRef();

  const scaleCurrent = useSharedValue(1);
  const scalePrevious = useSharedValue(1);

  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const xCurrent = useSharedValue(0);
  const yCurrent = useSharedValue(0);
  const xPrevious = useSharedValue(0);
  const yPrevious = useSharedValue(0);

  const pinchHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onStart: (event) => {
        if (event.numberOfPointers == 2) {
          focalX.value = event.focalX;
          focalY.value = event.focalY;
        }
        console.log({ current: scaleCurrent.value });
        console.log({ previous: scalePrevious.value });
      },
      onActive: (event) => {
        if (event.numberOfPointers == 2) {
          scaleCurrent.value = event.scale;

          xCurrent.value =
            (1 - scaleCurrent.value) * (focalX.value - width / 2);
          yCurrent.value =
            (1 - scaleCurrent.value) * (focalY.value - height / 2);
        }
      },
      onEnd: (event) => {
        if (scalePrevious.value * scaleCurrent.value < 1) {
          console.log("here");
          console.log(scalePrevious.value);
          scaleCurrent.value = withTiming(1, { duration: 500 });
          scalePrevious.value = withTiming(1, { duration: 500 });
        } else {
          console.log("here 2");
          scalePrevious.value = scalePrevious.value * scaleCurrent.value;
        }

        xPrevious.value = scaleCurrent.value * xPrevious.value + xCurrent.value;
        yPrevious.value = scaleCurrent.value * yPrevious.value + yCurrent.value;

        xCurrent.value = 0;
        yCurrent.value = 0;

        scaleCurrent.value = 1;
      },
    });

  const panHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      xCurrent.value = event.translationX;
      yCurrent.value = event.translationY;
    },
    onEnd: () => {
      xPrevious.value = scaleCurrent.value * xPrevious.value + xCurrent.value;
      yPrevious.value = scaleCurrent.value * yPrevious.value + yCurrent.value;

      xCurrent.value = 0;
      yCurrent.value = 0;
    },
  });

  const onSingleTap = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      console.log("I'm touched");
    }
  };
  const onDoubleTap = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      console.log("Double tap, good job!");
    }
  };

  const transformStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: xCurrent.value },
        { translateY: yCurrent.value },
        { scale: scaleCurrent.value },
        { translateX: xPrevious.value },
        { translateY: yPrevious.value },
        { scale: scalePrevious.value },
      ],
    };
  });

  return (
    <PinchGestureHandler onGestureEvent={pinchHandler}>
      <Animated.View style={{ flex: 1 }}>
        <TapGestureHandler
          waitFor={doubleTapRef}
          onHandlerStateChange={onSingleTap}
        >
          <TapGestureHandler
            onHandlerStateChange={onDoubleTap}
            ref={doubleTapRef}
            numberOfTaps={2}
          >
            <Animated.View style={{ flex: 1 }}>
              <PanGestureHandler onGestureEvent={panHandler}>
                <Animated.View style={styles.container}>
                  <Animated.View style={[styles.zoomArea, transformStyle]}>
                    <Text style={styles.title}>Zoom</Text>
                  </Animated.View>
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </TapGestureHandler>
        </TapGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  zoomArea: {
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
