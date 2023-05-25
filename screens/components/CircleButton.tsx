import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Circle, Svg } from "react-native-svg";
import React from "react";

type Props = {
  size: number;
  onPress: () => void;
};

const CircleWithHole = ({ onPress, size }: Props) => {
  const STROKE_WIDTH = 5;
  const INNER_CIRCLE_SIZE = size - STROKE_WIDTH * 2 - 4;

  const RADIUS = (size - STROKE_WIDTH) / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <TouchableOpacity style={styles.innerCircleContainer} onPress={onPress}>
        <View
          style={[
            styles.innerCircle,
            {
              width: INNER_CIRCLE_SIZE,
              height: INNER_CIRCLE_SIZE,
              borderRadius: INNER_CIRCLE_SIZE / 2,
            },
          ]}
        />
      </TouchableOpacity>

      <View style={[styles.outerCircle, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={RADIUS + STROKE_WIDTH / 2}
            cy={RADIUS + STROKE_WIDTH / 2}
            r={RADIUS}
            fill="transparent"
            strokeWidth={STROKE_WIDTH}
            stroke="white"
          />
        </Svg>
      </View>
    </View>
  );
};

export default CircleWithHole;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  outerCircle: {
    position: "absolute",
  },
  innerCircleContainer: {
    zIndex: 100,
  },
  innerCircle: {
    backgroundColor: "white",
  },
});
