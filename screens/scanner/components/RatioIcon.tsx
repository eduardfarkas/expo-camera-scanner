import { StyleSheet, Text, View } from "react-native";
import { Ratio } from "../scanner.constants";

type Props = {
    size: number;
    ratio: Ratio;
    active: boolean;
};

const RatioIcon = ({ size, ratio, active }: Props) => {
    const BASE_SIZE = size;
    const CONTAINER_SIZE = BASE_SIZE + 10;

    let holeWidth;
    let holeHeight;

    if (1 > ratio.ratio) {
        holeWidth = BASE_SIZE * ratio.ratio;
        holeHeight = BASE_SIZE;
    } else {
        holeWidth = BASE_SIZE;
        holeHeight = BASE_SIZE / ratio.ratio;
    }

    return (
        <View style={[styles.main, { height: CONTAINER_SIZE, width: CONTAINER_SIZE }]}>
            <View
                style={[
                    styles.ratio,
                    {
                        height: holeHeight,
                        width: holeWidth,
                        borderColor: active ? "#fdf44c" : "#ffffff",
                        backgroundColor: active
                            ? "rgba(253,244,76,0.25)"
                            : "rgba(255,255,255,0.25)",
                    },
                ]}
            ></View>
            {<Text style={styles.text}>{ratio.name ?? `${ratio.width}/${ratio.height}`}</Text>}
        </View>
    );
};

export default RatioIcon;

const styles = StyleSheet.create({
    main: {
        margin: 5,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    ratio: {
        borderRadius: 2,
        borderWidth: 2,
    },
    text: {
        position: "absolute",
        color: "#ffffff",
        fontSize: 10,
        bottom: -10,
    },
});
