
import { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from "react-native";

export function SendModal({ route, navigation }) {

    const [toAddr, setToAddr] = useState("");
    const [tokenAmount, setTokenAmount] = useState(0);

    const { ethPrice } = route.params;
    return (
        <View style={{ justifyContent: 'center', marginHorizontal: 18 }}>
            <View style={[styles.row, { justifyContent: 'center' }]}>
                <Text style={{ marginVertical: 18, fontSize: 20, fontWeight: '500' }}>Send</Text>
            </View>

            <View style={[styles.row]}>
                <Text style={{ flex: 1, fontSize: 20, fontWeight: '500' }}>To: </Text>
                <TextInput
                    placeholder="address or ENS"
                    style={{
                        flex: 7,
                        fontSize: 18,
                        fontWeight: '500',
                        height: 36,
                    }}
                    onChangeText={setToAddr}
                    value={toAddr}
                />
            </View>

            <View style={[styles.row, { marginTop: 24 }]}>
                <TextInput
                    placeholder="0.00"
                    style={{
                        flex: 2,
                        fontSize: 36,
                        height: 36,
                    }}
                    onChangeText={setTokenAmount}
                    value={tokenAmount}
                />
                <Text style={{ flex: 1, fontSize: 30, fontWeight: '500' }}>ETH</Text>
            </View>
            <View style={[styles.row]}>
                <Text style={{ fontSize: 24, fontWeight: '500', marginTop: 18, color: '#777' }}>~${(Number(tokenAmount) * ethPrice).toFixed(2)} USD</Text>
            </View>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#0E76FD', marginTop: 24 }]} >
                <Text
                    style={{
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: "600",
                    }}>
                    Send
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { marginTop: 6 }]}
                onPress={() => navigation.goBack()}
            >
                <Text
                    style={{
                        color: '#0E76FD',
                        fontSize: 20,
                        fontWeight: "600",
                    }}>
                    Cancel
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        display: 'flex', flexDirection: 'row', alignItems: 'center'
    },
    button: {
        marginHorizontal: 24,
        height: 54,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});