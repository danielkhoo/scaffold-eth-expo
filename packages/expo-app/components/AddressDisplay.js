
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as Clipboard from 'expo-clipboard';

export default function AddressDisplay(props) {

    const toast = props.toast

    const address = props.address || ''

    const copyToClipboard = () => {
        console.log(address);
        Clipboard.setString(address);
    };

    const fetchCopiedText = async () => {
        const text = await Clipboard.getStringAsync();
        console.log(text);
    };

    let displayAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {displayAddress}
            </Text>
            <View style={styles.section}>
                <TouchableOpacity onPress={() => {
                    copyToClipboard()
                    toast({
                        position: 'bottom',
                        visibilityTime: 1000,
                        type: 'success',
                        text1: 'Copied'
                    })
                }}>
                    <Text
                        style={styles.textButton}>
                        Copy Address
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    // onPress={fetchCopiedText}
                    onPress={() => props.navigation.navigate('DisplayQRModal', { address })}
                >
                    <Text
                        style={styles.textButton}>
                        View QR
                    </Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12
    },
    text: {
        fontSize: 28,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 16,
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginBottom: 24
    },
    textButton: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
});