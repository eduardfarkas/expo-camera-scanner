import { Button, ScrollView, StyleSheet, View } from "react-native";
import { RootScreenProps } from "../navigation/types";
import Thumbnail from "./scanner/components/animated/Thumbnail";
import React from "react";

export default function PictureScreen({ navigation, route }: RootScreenProps<"Picture">) {
    const { photos } = route.params;

    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginTop: 100, marginBottom: 10 }}>
                <Button
                    title="Navigate home"
                    onPress={() => {
                        navigation.reset({ index: 0, routes: [{ name: "Main" }] });
                    }}
                />
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
                {photos.map((photo, index) => (
                    <View key={index} style={{ margin: 10, backgroundColor: "red" }}>
                        <Thumbnail uri={photo.uri} size={250} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
});
