import { Button, Image, StyleSheet, View } from "react-native";
import { RootScreenProps } from "../navigation/types";
import * as ImageManipulator from "expo-image-manipulator";
import { SaveFormat } from "expo-image-manipulator";
import { useState } from "react";

export default function PictureScreen({
  navigation,
  route,
}: RootScreenProps<"Picture">) {
  const { pictureData } = route.params;
  const [croppedImageUri, setCroppedImageUri] = useState<string | undefined>(
    undefined
  );

  const handleCrop = () => {
    ImageManipulator.manipulateAsync(
      pictureData.uri,
      [
        {
          crop: {
            originX: pictureData.width * 0.1,
            originY: pictureData.height * 0.15,
            height: pictureData.height * 0.7,
            width: pictureData.width * 0.8,
          },
        },
      ],
      {
        compress: 1,
        format: SaveFormat.JPEG,
      }
    ).then((data) => {
      setCroppedImageUri(data.uri);
    });
  };

  return (
    <View style={styles.container}>
      {croppedImageUri ? (
        <Image
          style={{ resizeMode: "contain", width: 600, height: 600 }}
          source={{ uri: croppedImageUri }}
        />
      ) : (
        <Image
          style={{ resizeMode: "contain", width: 600, height: 600 }}
          source={{ uri: pictureData.uri }}
        />
      )}
      <Button title="Crop" onPress={handleCrop} />
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
