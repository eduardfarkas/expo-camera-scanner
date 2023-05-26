import { StyleSheet, Text, View } from "react-native";
import React from "react";

const FirstView = () => {
    return (
        <View style={styles.main}>
            <Text style={styles.title}>Hello</Text>
        </View>
    );
};

export default FirstView;

const styles = StyleSheet.create({
    main: {
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
