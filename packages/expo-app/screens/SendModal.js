
import { useState, useContext } from "react";
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from "react-native";
import { useGasPrice } from "eth-hooks/useGasPrice";
import { txContext } from '../context/txContext';
import { ethers } from "ethers";
import Toast from 'react-native-toast-message';
import { useStaticJsonRPC } from "../hooks";


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function SendModal({ route, navigation }) {

    const [toAddr, setToAddr] = useState("0xA00F36889e25249492f93e00852Ba183776DC747");
    const [tokenAmount, setTokenAmount] = useState("0");
    const [loading, setLoading] = useState(false);

    const wallet = useContext(txContext);

    const { ethPrice, targetNetwork } = route.params;

    const localProvider = useStaticJsonRPC([targetNetwork.rpcUrl]);

    const sendTxn = async () => {
        setLoading(true)
        const signer = wallet.connect(localProvider);

        try {

            const tx = await signer.sendTransaction({
                to: toAddr,
                value: ethers.utils.parseEther(tokenAmount),
                data: ""
            })

            const pendingTxn = await localProvider.getTransaction(tx.hash)
            console.log(pendingTxn);

            Toast.show({
                position: 'top',
                visibilityTime: 1000,
                type: 'success',
                text1: 'Transaction sent'
            })

            localProvider.once(tx.hash, transaction => {
                console.log('MINED!!');
                console.log(transaction);
                Toast.show({
                    position: 'top',
                    visibilityTime: 1000,
                    type: 'success',
                    text1: 'Transaction successful'
                })
            })

            await timeout(2000)// Intentional Delay

            navigation.goBack()

        } catch (err) {
            console.log(err.toString());
            Toast.show({
                position: 'top',
                visibilityTime: 4000,
                type: 'error',
                text1: 'Error',
                text2: err.toString()
            })
        } finally {
            setLoading(false)
        }


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
            <TouchableOpacity
                style={[styles.button, { backgroundColor: loading ? '#777' : '#0E76FD', marginTop: 24 }]}
                onPress={sendTxn}
                disabled={loading}>
                <Text
                    style={{
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: "600",
                    }}>
                    Send
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, { marginTop: 6 }]}
                onPress={() => navigation.goBack()}
                disabled={loading}
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

            <Toast />
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