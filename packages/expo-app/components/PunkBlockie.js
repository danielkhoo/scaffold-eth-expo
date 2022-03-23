
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { WebView } from 'react-native-webview';

export default function PunkBlockie(props) {
    const address = props.address
    const punkSize = props.size;
    const scaledPunkSize = punkSize * 4
    let part1 = address && address.substr(2, 20);
    let part2 = address && address.substr(22);
    const x = parseInt(part1, 16) % 100;
    const y = parseInt(part2, 16) % 100;
    return (
        <View style={{ width: punkSize, height: punkSize }}>
            {/* PUNK IS BLURRY DUE TO ANTI-ALIASING, CSS IMAGE RENDERING "PIXELATED" NOT AVAILABLE ON REACT NATIVE */}
            {/* <Image source={punks} 
            style={{
                left: -iconPunkSize * x,
                top: -iconPunkSize * y,
                width: iconPunkSize * 100,
                height: iconPunkSize * 100,
                imageRendering: "pixelated",
              }}
            /> */}
            {/* EXTREMELY HACKY SOLUTION, LOAD IMAGE IN A WEBVIEW */}
            <WebView
                style={{ width: punkSize, height: punkSize }}
                scrollEnabled={false}
                // originWhitelist={['*']}
                source={{
                    html: `
                <div style="position: absolute; width: ${scaledPunkSize}; height: ${scaledPunkSize}; overflow: hidden;">
                <img src="https://www.larvalabs.com/public/images/cryptopunks/punks.png" 
                style="position: absolute; image-rendering: pixelated; height: ${scaledPunkSize * 100}; width: ${scaledPunkSize * 100}; left:${-scaledPunkSize * x}; top:${-scaledPunkSize * y - 1}"/>
                </div>
                ` }}
            />
        </View>
    )
}

const styles = StyleSheet.create({});