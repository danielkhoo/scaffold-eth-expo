
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { WebView } from 'react-native-webview';

export default function PunkBlockie(props) {
    const punkSize = 360;
    const address = props.address
    let part1 = address && address.substr(2, 20);
    let part2 = address && address.substr(22);
    const x = parseInt(part1, 16) % 100;
    const y = parseInt(part2, 16) % 100;
    return (
        <View style={{ width: 90, height: 90 }}>
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
                style={{ width: 90, height: 90 }}
                scrollEnabled={false}
                // originWhitelist={['*']}
                source={{
                    html: `
                <div style="position: absolute; width: ${punkSize}; height: ${punkSize}; overflow: hidden;">
                <img src="https://www.larvalabs.com/public/images/cryptopunks/punks.png" 
                style="position: absolute; image-rendering: pixelated; height: ${punkSize * 100}; width: ${punkSize * 100}; left:${-punkSize * x}; top:${-punkSize * y - 1}"/>
                </div>
                ` }}
            />
        </View>
    )
}

const styles = StyleSheet.create({});