import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
    const isLoadingComplete = useCachedResources();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <Navigation colorScheme={"light"} />
                    <StatusBar style="dark" />
                </GestureHandlerRootView>
            </SafeAreaProvider>
        );
    }
}
