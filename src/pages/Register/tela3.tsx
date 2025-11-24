// TELA 3 "CONTATO DE CONFIANÇA"

import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from 'react-native-animatable'

export function Tela3() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Animatable.Text animation="fadeInLeft" delay={300} style={styles.message}>Hora de  </Animatable.Text>
                <Animatable.Text animation="fadeInLeft" delay={400} style={styles.message}>configurar seu</Animatable.Text>
                <Animatable.Text animation="fadeInLeft" delay={500} style={styles.message}>contato de</Animatable.Text>
                <Animatable.Text animation="fadeInLeft" delay={500} style={styles.message}>confiança</Animatable.Text>
            </View>

            <Animatable.View animation="fadeInUp" delay={200} style={styles.containerForm}>

                <Animatable.View
                    animation="flipInY"
                    delay={500}
                >
                    <TouchableOpacity
                        style={styles.buttonEmergencia}
                    >
                        <Text style={styles.textButton}>Botão de</Text>
                        <Text style={styles.textButton}>emergência</Text>
                    </TouchableOpacity>
                </Animatable.View>

                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Tela4')}
                    >
                        <Text style={styles.buttonText}>Configurar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonVoltar}
                        onPress={() => navigation.navigate('Tela5')}
                    >
                        <Text style={styles.voltarBtnText}>Pular Etapa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonVoltar}
                        onPress={() => navigation.navigate('Tela2')}
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
    button: {
        backgroundColor: '#006FFD',
        height: 59,
        borderRadius: 15,
        width: '100%',
        paddingVertical: 8,
        marginTop: 60,
        marginBottom: 15,
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
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    voltarBtnText: {
        color: '#006FFD',
        fontSize: 18,
        fontWeight: 'bold',
    },

    // BOTAO DE EMERGENCIA

    buttonEmergencia: {
        borderRadius: 999,
        alignSelf: 'center',
        height: 170,
        width: 170,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#C13131',
        borderWidth: 12,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        marginTop: '10%'
    },
    textButton: {
        color: '#C13131',
        fontSize: 20,
        fontWeight: 'bold'
    },
})