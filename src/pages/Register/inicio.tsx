// TELA INICIO "SUAS SUBSTANCIAS"

import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from 'react-native-animatable'
import { useUser } from "../../context/UserContext";

export function Register() {
    const { dadosUser, setDadosUser } = useUser();
    const navigation = useNavigation<any>();
    const [selectedSubstance, setSelectedSubstance] = useState<string>('');

    const substances = [
        { label: 'Maconha', value: 'maconha' },
        { label: 'Cocaina', value: 'cocaina' },
        { label: 'Tabaco', value: 'tabaco' },
        { label: 'Alcool', value: 'alcool' },
    ];

    function handleNext() {
        setDadosUser({ substance: selectedSubstance });
        navigation.navigate('Tela2');
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Animatable.Text animation="fadeInLeft" delay={300} style={styles.message}>Vamos começar </Animatable.Text>
                <Animatable.Text animation="fadeInLeft" delay={400} style={styles.message}>com a sua</Animatable.Text>
                <Animatable.Text animation="fadeInLeft" delay={500} style={styles.message}>substância</Animatable.Text>
            </View>

            <Animatable.View animation="fadeInUp" delay={200} style={styles.containerForm}>
                <Text style={styles.subTitle}>Selecione abaixo a substância que te aflinge</Text>

                <View style={styles.divPicker}>
                    <Picker
                        selectedValue={selectedSubstance}
                        onValueChange={(itemValue: any) => setSelectedSubstance(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleciona uma substância" value="" />
                        {substances.map((substance) => (
                            <Picker.Item key={substance.value} label={substance.label} value={substance.value} />
                        ))}
                    </Picker>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleNext}
                    disabled={selectedSubstance ? false : true}
                >
                    <Text style={styles.buttonText}>Próximo passo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonVoltar}
                    onPress={() => navigation.navigate('SignIn')}
                >
                    <Text style={styles.voltarBtnText}>Voltar</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    containerHeader: {
        marginTop: '15%',
        marginBottom: '8%',
        padding: '5%',
    },
    message: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#2c75b5',
    },
    containerForm: {
        flex: 1,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    subTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 60
    },
    divPicker: {
        position: 'relative',
        height: 60,
        marginBottom: 60,
        borderRadius: 15,
        borderColor: '#C5C6CC',
        borderWidth: 1,
    },
    picker: {
        position: 'absolute',
        top: -80,
        width: '100%',
    },
    button: {
        backgroundColor: '#006FFD',
        height: 59,
        borderRadius: 15,
        width: '100%',
        paddingVertical: 8,
        marginTop: 60,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonVoltar: {
        borderWidth: 2,
        borderColor: '#006FFD',
        height: 56,
        borderRadius: 15,
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    voltarBtnText: {
        color: '#006FFD',
        fontSize: 18,
        fontWeight: 'bold',
    },
})