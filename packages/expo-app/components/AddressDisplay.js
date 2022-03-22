
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function AddressDisplay(props) {

    const address = props.address || ''
    let displayAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {displayAddress}
            </Text>
            <View style={styles.section}>
                <TouchableOpacity onPress={() => { }}>
                    <Text
                        style={styles.textButton}>
                        Copy Address
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { }}>
                    <Text
                        style={styles.textButton}>
                        Display QR
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