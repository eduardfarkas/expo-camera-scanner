import { Button, StyleSheet, Text, View } from "react-native";
import { RootScreenProps } from "../navigation/types";
import React from "react";

export default function MainScreen({ navigation }: RootScreenProps<"Main">) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
      <Button
        title="Open camera"
        onPress={() => navigation.navigate("Camera")}
      />
      <Button title="Zoom screen" onPress={() => navigation.navigate("Zoom")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
