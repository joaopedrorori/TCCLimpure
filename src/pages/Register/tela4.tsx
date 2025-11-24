// TELA 4 "CONFIGURANDO CONTATO DE CONFIANÇA"

import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import * as Animatable from 'react-native-animatable'
import { useUser } from "../../context/UserContext";

export function Tela4() {
    const { setDadosUser } = useUser();
    const navigation = useNavigation<any>();
    const [numberContact, setNumberContact] = useState('');
    const [nameContact, setNameContact] = useState('');

    function handleNextPage() {
        setDadosUser({ trustedContactNumber: numberContact });
        setDadosUser({ trustedContactName: nameContact });
        navigation.navigate('Tela5')
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Animatable.Text animation="fadeInLeft" delay={300} style={styles.message}>Para quem</Animatable.Text>
                <Animatable.Text animation="fadeInLeft" delay={400} style={styles.message}>ligar em</Animatable.Text>
                <Animatable.Text animation="fadeInLeft" delay={500} style={styles.message}>momentos</Animatable.Text>
                <Animatable.Text animation="fadeInLeft" delay={500} style={styles.message}>difíceis?</Animatable.Text>
            </View>

            <Animatable.View animation="fadeInUp" delay={200} style={styles.containerForm}>
                <Text style={styles.subTitle}>Nos diga o número de uma pessoa de
                    confiança que você possa ligar em momentos difíceis</Text>

                <TextInput
                    style={styles.input}
                    placeholder="DDD 99999-9999"
                    value={numberContact}
                    onChangeText={setNumberContact}

                />

                <Text style={styles.subTitle}>Agora o nome dessa pessoa.</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Digite o nome aqui"
                    value={nameContact}
                    onChangeText={setNameContact}
                />

                <View>
                    <TouchableOpacity
                        style={styles.buttonVoltar}
                        onPress={handleNextPage}
                    >
                        <Text style={styles.voltarBtnText}>Próximo passo</Text>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30
    },
    input: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#C5C6CC',
        padding: '5%',
        height: 60,
        marginBottom: 40,
        fontSize: 16,
    },
    buttonVoltar: {
        borderWidth: 2,
        borderColor: '#006FFD',
        height: 56,
        borderRadius: 15,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    voltarBtnText: {
        color: '#006FFD',
        fontSize: 18,
        fontWeight: 'bold',
    },
})