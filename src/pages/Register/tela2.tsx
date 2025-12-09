// TELA 2 "MOTIVOS PARA PARAR DE USAR"

import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useUser } from "../../context/UserContext";
import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/FontAwesome5';

export function Tela2() {
    const { dadosUser, setDadosUser } = useUser();
    const navigation = useNavigation<any>();
    const [reasons, setReasons] = useState<string[]>(dadosUser.reasons || []);
    const [reasonInput, setReasonInput] = useState<string>('');

    function handleRasons() {
        if (reasonInput.trim()) {
            setReasons([...reasons, reasonInput]);
            setReasonInput('')
        }
    }

    function removeRasons(index: number) {
        setReasons(reasons.filter((_, i) => i !== index));
    }

    function handleNext() {
        setDadosUser({ reasons: reasons });
        navigation.navigate('Tela3');
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Animatable.Text animation="fadeInLeft" delay={300} style={styles.message}>Por quais</Animatable.Text>
                <Animatable.Text animation="fadeInLeft" delay={400} style={styles.message}>motivos você</Animatable.Text>
                <Animatable.Text animation="fadeInLeft" delay={500} style={styles.message}>decidiu parar?</Animatable.Text>
            </View>

            <Animatable.View animation="fadeInUp" delay={200} style={styles.containerForm}>
                <Text style={styles.subTitle}>Nos diga o(s) motivo(s) da sua iniciativa contra a dependência</Text>

                <View style={styles.divInput}>
                    <TextInput
                        style={styles.input}
                        placeholder="Adicionar motivo"
                        value={reasonInput}
                        onChangeText={setReasonInput}
                    />
                    <Icon
                        style={styles.icon}
                        name="plus"
                        size={24}
                        color={'#007AFF'}
                        onPress={handleRasons}
                    />
                </View>

                <View style={styles.divScroll}>
                    <ScrollView>
                        {reasons.map((item, index) => (
                            <View style={styles.divInput} key={`${item}-${index}`}>
                                <View style={styles.input}>
                                    <Text>{item}</Text>
                                </View>
                                <Icon
                                    style={styles.icon}
                                    name="minus"
                                    size={24}
                                    color={'red'}
                                    onPress={() => removeRasons(index)}
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.divButton}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleNext}
                    >
                        <Text style={styles.buttonText}>Próximo passo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonVoltar}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.voltarBtnText}>Voltar</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        position: 'relative',
    },
    containerHeader: {
        marginTop: '10%',
        marginBottom: '4%',
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
        marginBottom: 30
    },
    divInput: {
        position: 'relative',
        width: '100%'
    },
    input: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#C5C6CC',
        padding: '5%',
        height: 60,
        marginBottom: 10,
        fontSize: 16,
    },
    icon: {
        padding: 15,
        position: 'absolute',
        top: '50%',
        right: 0,
        transform: [{ translateY: -30 }],
    },
    divButton: {
        position: 'absolute',
        width: '100%',
        bottom: 80,
        left: 20
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
        marginTop: 0,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    voltarBtnText: {
        color: '#006FFD',
        fontSize: 18,
        fontWeight: 'bold',
    },
    divScroll: {
        maxHeight: 180,
        overflow: "hidden",
        borderRadius: 8,
    }
})