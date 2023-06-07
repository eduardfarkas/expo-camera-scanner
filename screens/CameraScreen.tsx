import { StyleSheet, View } from "react-native";
import { RootScreenProps } from "../navigation/types";
import React from "react";
import Scanner from "./scanner/components/Scanner";

export default function CameraScreen({ navigation }: RootScreenProps<"Camera">) {
    return (
        <View style={styles.container}>
            <Scanner
                onSave={(photos) => {
                    console.log(photos);
                    navigation.navigate("Picture", { photos: photos });
                }}
                onClose={() => {
                    navigation.goBack();
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
});
