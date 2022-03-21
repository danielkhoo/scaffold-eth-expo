
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function AddressDisplay(props) {

    const address = props.address || ''
    let displayAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    return (
        <View>
            <Text style={[styles.text]}>
                {displayAddress}
            </Text>
            <View style={[styles.section]}>
                <TouchableOpacity onPress={() => { }}>
                    <Text
                        style={[styles.textButton]}>
                        Copy Address
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { }}>
                    <Text
                        style={[styles.textButton]}>
                        Display QR
                    </Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 28,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 24,
    },
    section: {

        flexDirection: 'row', justifyContent: 'space-around',
        width: '80%',
        marginBottom: 24
    },
    textButton: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
});