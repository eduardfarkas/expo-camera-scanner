import { FlatList, Image, StyleSheet, useWindowDimensions, View } from "react-native";
import { RootScreenProps } from "../navigation/types";
import Zoom from "./gallery/Zoom";
import { useCallback } from "react";
import Animated from "react-native-reanimated";
import { createZoomListWithReanimatedComponent } from "./gallery/createZoomListComponent";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<string>);
const ZoomFlatList = createZoomListWithReanimatedComponent(AnimatedFlatList);
// const ZoomFlatList = createZoomListComponent(FlatList);

export default function ZoomScreen({ navigation }: RootScreenProps<"Zoom">) {
    const dimension = useWindowDimensions();

    const data: string[] = [
        "https://images.unsplash.com/photo-1536152470836-b943b246224c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1038&q=80",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3274&q=80",
        "https://images.unsplash.com/photo-1439853949127-fa647821eba0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
        "https://images.unsplash.com/photo-1444464666168-49d633b86797?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3269&q=80",
    ];

    const itemPadding = 10;

    const renderItem = useCallback(
        ({ item }: { item: string }) => {
            return (
                <View
                    style={{
                        padding: itemPadding,
                    }}
                >
                    <Zoom>
                        <Image
                            source={{
                                uri: item,
                            }}
                            style={{
                                width: dimension.width - itemPadding * 2,
                                height: dimension.width - itemPadding * 2,
                            }}
                        />
                    </Zoom>
                </View>
            );
        },
        [dimension]
    );

    return (
        <ZoomFlatList
            data={data}
            pagingEnabled
            horizontal
            keyExtractor={(item) => item}
            renderItem={renderItem}
            contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
});
