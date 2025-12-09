import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import * as Animatable from 'react-native-animatable';
import { auth } from "../../services/firebase";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useUser } from "../../context/UserContext";

export function SignIn() {
    const navigation = useNavigation<any>();
    const { setUserLogado } = useUser(); 
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    function signIn() {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential: any) => {
                const user = userCredential.user;
                setEmail('');
                setPassword('');
                setErrorMessage(null);

                const userData = {
                    uid: user.uid,
                    name: user.displayName || "",
                };
                setUserLogado(userData); 

                navigation.navigate('Home');
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    setErrorMessage('E-mail já está em uso.');
                } else if (error.code === 'auth/invalid-email') {
                    setErrorMessage('Email inválido');
                } else {
                    setErrorMessage('Erro ao entrar. Tente novamente.');
                }
            });
    }

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>LIMPURE</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Email</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Digite um email..."
                    style={styles.input}
                />

                <Text style={styles.title}>Senha</Text>
                <View>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!isPasswordVisible}
                        placeholder="Sua senha"
                        style={styles.input}
                    />
                    <TouchableOpacity
                        onPress={() => setPasswordVisible(!isPasswordVisible)}
                        style={styles.eyeButton}
                    >
                        <Icon name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20}></Icon>
                    </TouchableOpacity>
                </View>
                {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
                <TouchableOpacity
                    style={styles.button}
                    onPress={signIn}
                >
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

                <Text style={styles.registerText}>Não possui uma conta? Cadastres-se</Text>

                <TouchableOpacity
                    style={styles.buttonRegister}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.registerBtnText}>Registre-se</Text>
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
        marginTop: '20%',
        marginBottom: '8%',
        padding: '5%',
    },
    message: {
        alignSelf: 'center',
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
    title: {
        fontSize: 20,
        marginTop: 28,
        marginBottom: 10
    },
    input: {
        position: 'relative',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#C5C6CC',
        padding: '5%',
        height: 60,
        marginBottom: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#006FFD',
        height: 59,
        borderRadius: 15,
        width: '100%',
        paddingVertical: 8,
        marginTop: 40,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonRegister: {
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
    registerText: {
        color: '#a1a1a1',
        marginBottom: 10
    },
    registerBtnText: {
        color: '#006FFD',
        fontSize: 18,
        fontWeight: 'bold',
    },
    eyeButton: {
        padding: 20,
        position: 'absolute',
        top: 0,
        right: 5,
    }
});
