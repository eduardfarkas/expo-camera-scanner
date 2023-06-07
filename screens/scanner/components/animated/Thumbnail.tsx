import Animated, { FadeInUp } from "react-native-reanimated";
import React from "react";

type Props = {
    uri: string;
    size?: number;
};

const Thumbnail = ({ uri, size = 70 }: Props) => {
    return (
        <Animated.View
            entering={FadeInUp}
            style={{
                width: size,
                height: size,
            }}
        >
            <Animated.Image
                style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                }}
                source={{
                    uri,
                }}
            />
        </Animated.View>
    );
};

export default Thumbnail;
