import { StyleSheet, Text, View } from "react-native";
import QRCode from 'react-native-qrcode-svg';

import PunkBlockie from "../components/PunkBlockie";
export function DisplayQRModal({ route, navigation }) {

    const { address } = route.params;
    let displayAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Wallet Address
            </Text>
            <View style={{ marginTop: 48 }}>
                <QRCode
                    value={address}
                    size={320}
                    quietZone={8}
                    backgroundColor={'#fff'}
                />
            </View>
            <View style={{ position: 'absolute', top: 240 }}>
                <PunkBlockie address={address} size={80} />
            </View>
            <Text style={styles.text}>
                {displayAddress}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#555',
        alignItems: 'center'
    },
    text: {
        marginTop: 48,
        fontSize: 28,
        fontWeight: "600",
        textAlign: "center",
        color: '#fff'
    },
});