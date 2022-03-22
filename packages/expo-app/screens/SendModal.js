
import { useState, useContext } from "react";
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from "react-native";
import { useGasPrice } from "eth-hooks/useGasPrice";
import { txContext } from '../context/txContext';
import { ethers } from "ethers";
import { useStaticJsonRPC } from "../hooks";

export function SendModal({ route, navigation }) {

    const [toAddr, setToAddr] = useState("0xA00F36889e25249492f93e00852Ba183776DC747");
    const [tokenAmount, setTokenAmount] = useState("0");

    const wallet = useContext(txContext);

    const { ethPrice, targetNetwork } = route.params;

    const localProvider = useStaticJsonRPC([targetNetwork.rpcUrl]);

    const sendTxn = async () => {
        const signer = wallet.connect(localProvider);
        await signer.sendTransaction({
            to: toAddr,
            value: ethers.utils.parseEther(tokenAmount),
            data: ""
        });
    }


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
            <TouchableOpacity style={[styles.button, { backgroundColor: '#0E76FD', marginTop: 24 }]} onPress={sendTxn}>
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