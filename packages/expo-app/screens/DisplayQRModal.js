
import { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from "react-native";

export function DisplayQRModal({ route, navigation }) {

    const { address } = route.params;
    return (
        <View style={{ justifyContent: 'center', marginHorizontal: 18 }}>
            <Text>{address}</Text>
        </View>
    );
}

const styles = StyleSheet.create({

});