// TELA 5 "CONFIGURANDO CONTATO DE CONFIANÇA"

import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useUser } from "../../context/UserContext";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { doc, setDoc } from "firebase/firestore";

export function Tela5() {
    const { setDadosUser } = useUser();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const navigation = useNavigation<any>();
    const [nome, setNome] = useState('');
    const [numero, setNumero] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [terms, setTerms] = useState(false);
    const [receiveEmails, setReceiveEmails] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        if (!nome.trim()) return setErrorMessage('O campo Nome é obrigatório');
        if (!email.trim()) return setErrorMessage('O campo Email é obrigatório');
        if (!senha.trim()) return setErrorMessage('O campo Senha é obrigatório');
        if (!terms) return setErrorMessage('Você deve aceitar os Termos de Serviço');
        if (senha !== confirmSenha) return setErrorMessage('Senhas não conferem');
        if (!email.includes('@')) return setErrorMessage('O email deve ser válido.');

        setErrorMessage(null);
        setLoading(true);

        const dadosAtualizados = {
            name: nome,
            phone: numero,
            email: email,
            terms: terms,
            communicationEmail: receiveEmails,
            cleanDate: new Date()
        };

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            await updateProfile(userCredential.user, {
                displayName: nome,
            });

            setDadosUser(dadosAtualizados);

            await setDoc(doc(db, "users", userCredential.user.uid), dadosAtualizados);
            navigation.navigate('Home');
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                setErrorMessage('E-mail já está em uso.');
            } else if (error.code === 'auth/invalid-email') {
                setErrorMessage('Email inválido');
            } else if (error.code === 'auth/invalid-credential') {
                setErrorMessage('Credenciais inválidas. Verifique seu e-mail e senha.');
            } else {
                setErrorMessage('Erro ao cadastrar. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.containerHeader}>
                    <Animatable.Text animation="fadeInLeft" delay={300} style={styles.message}>Agora</Animatable.Text>
                    <Animatable.Text animation="fadeInLeft" delay={400} style={styles.message}>precisamos</Animatable.Text>
                    <Animatable.Text animation="fadeInLeft" delay={500} style={styles.message}>de algumas</Animatable.Text>
                    <Animatable.Text animation="fadeInLeft" delay={500} style={styles.message}>informações</Animatable.Text>
                </View>

                <Animatable.View animation="fadeInUp" delay={200} style={styles.containerForm}>
                    <Text style={styles.subTitle}>Preencha os campos abaixo para continuar</Text>

                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome completo"
                        value={nome}
                        onChangeText={setNome}
                    />
                    <Text style={styles.label}>Número de celular</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="DDD 99999-9999"
                        value={numero}
                        onChangeText={setNumero}
                    />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <View>
                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Senha"
                            secureTextEntry={!isPasswordVisible}
                            value={senha}
                            onChangeText={setSenha}
                        />
                        <TouchableOpacity
                            onPress={() => setPasswordVisible(!isPasswordVisible)}
                            style={styles.eyeButton}
                        >
                            <Icon name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20}></Icon>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.label}>Confirme sua senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirme sua senha"
                            secureTextEntry={!isPasswordVisible}
                            value={confirmSenha}
                            onChangeText={setConfirmSenha}
                        />
                        <TouchableOpacity
                            onPress={() => setPasswordVisible(!isPasswordVisible)}
                            style={styles.eyeButton}
                        >
                            <Icon name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20}></Icon>
                        </TouchableOpacity>
                        {errorMessage && <Text style={styles.errorMsg}>{errorMessage}</Text>}
                    </View>
                    <View style={styles.divRadioContainer}>
                        <TouchableOpacity
                            style={styles.radioBtn}
                            onPress={() => setTerms(!terms)}
                        >
                            <View style={[styles.radioCircle, terms && styles.selectedRadio]} />
                        </TouchableOpacity>
                        <Text style={styles.terms}>
                            Aceite os <Text style={styles.link}>Termos de Serviço e Política de Privacidade</Text>
                        </Text>
                    </View>

                    <View style={styles.divRadioContainer}>
                        <TouchableOpacity
                            style={styles.radioBtn}
                            onPress={() => setReceiveEmails(!receiveEmails)}
                        >
                            <View style={[styles.radioCircle, receiveEmails && styles.selectedRadio]} />
                        </TouchableOpacity>
                        <Text style={styles.terms}>Deseja receber comunicações via e-mail?</Text>
                    </View>

                    <View>
                        <TouchableOpacity
                            style={styles.buttonVoltar}
                            onPress={handleRegister}
                        >
                            {loading ? (
                                <ActivityIndicator size="large" color='#006FFD' />
                            ) : (
                                <Text style={styles.voltarBtnText}>Concluir cadastro</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </ScrollView>
        </View>
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
    divScroll: {
        overflow: "hidden",
        borderRadius: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    input: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#C5C6CC',
        padding: '5%',
        height: 60,
        marginBottom: 30,
        fontSize: 16,
    },
    terms: {
        fontSize: 15,
        marginBottom: 20,
        maxWidth: '90%'
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline'
    },
    buttonVoltar: {
        borderWidth: 2,
        borderColor: '#006FFD',
        height: 56,
        borderRadius: 15,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 200,
        marginTop: 30,
    },
    voltarBtnText: {
        color: '#006FFD',
        fontSize: 18,
        fontWeight: 'bold',
    },
    eyeButton: {
        padding: 20,
        position: 'absolute',
        top: 25,
        right: 5,
    },


    // =================================

    divRadioContainer: {
        flexDirection: 'row',
    },
    radioBtn: {
        paddingLeft: 10
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    selectedRadio: {
        backgroundColor: '#007AFF',
    },


    errorMsg: {
        color: 'red', marginBottom: 15, position: 'relative',
        top: 0
    }
})