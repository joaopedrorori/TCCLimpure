import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import Menu from "../../components/menu";
import { useUser } from "../../context/UserContext";
import { database } from "../../services/firebase";
import { onValue, ref, push, remove, set } from "firebase/database";
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome5';

export function Gatilhos({ navigation, route }: any) {
    const [gatilhos, setGatilhos] = useState<any[]>([]);
    const [input, setInput] = useState<string>('');
    const { user, estaConfiguradoGatilho } = useUser();

    useEffect(() => {
        if (user && user.uid) {
            const gatilhosRef = ref(database, `users/${user.uid}/gatilhos`);
            const unsubscribeGatilhos = onValue(gatilhosRef, (snapshot) => {
                const gatilhosData = snapshot.val();
                if (gatilhosData) {
                    const gatilhosList = Object.entries(gatilhosData).map(([id, text]) => ({ id, text }));
                    setGatilhos(gatilhosList);
                } else {
                    setGatilhos([]);
                }
            });

            return () => unsubscribeGatilhos();
        }
    }, [user]);

    function configurar() {
        if (user && user.uid) {
            set(ref(database, `users/${user.uid}/estaConfiguradoGatilho`), true);
        } else {
            console.error("Usuário não autenticado.");
        }
    }

    async function handleGatilho() {
        if (user && user.uid && input.trim()) {
            const gatilhosRef = ref(database, `users/${user.uid}/gatilhos`);
            const newGatilhoRef = await push(gatilhosRef, input);
            setInput('');
        }
    }

    function removeGatilho(id: string) {
        if (user && user.uid) {
            const gatilhoRef = ref(database, `users/${user.uid}/gatilhos/${id}`);
            remove(gatilhoRef)
                .catch((error) => {
                    console.error("Erro ao remover gatilho: ", error);
                });
        }
    }

    return (
        estaConfiguradoGatilho
            ? <View style={styles.container}>
                <View style={styles.divMain}>
                    <Animatable.Text
                        delay={400}
                        animation="fadeInLeft"
                        style={styles.h1}>Vamos adicionar um gatilho?</Animatable.Text>
                    <Animatable.Text
                        delay={500}
                        animation="fadeInLeft"
                        style={styles.texto}>
                        Pense no que te faz querer utilizar a sua substância e escreva abaixo:
                    </Animatable.Text>
                    <Animatable.Text
                        delay={500}
                        animation="fadeInLeft"
                        style={styles.texto}>
                        Caso não consiga identificar algo por sua conta, recomendamos que procure
                        um profissional da área da saúde. Com a ajuda de um profissional,
                        sua caminhada será muito mais fácil!
                    </Animatable.Text>
                </View>
                <Animatable.View animation="fadeInLeft" delay={600}>
                    <View style={styles.divInput}>
                        <TextInput
                            style={styles.input}
                            placeholder="Adicionar gatilho"
                            value={input}
                            onChangeText={setInput}
                        />
                        <Icon
                            style={styles.icon}
                            name="plus"
                            size={24}
                            color={'#007AFF'}
                            onPress={handleGatilho}
                        />
                    </View>

                    <Animatable.View animation="fadeInLeft" delay={600} style={styles.divScroll}>
                        <ScrollView>
                            {gatilhos.map((gatilho) => (
                                <View style={styles.divInput} key={gatilho.id}>
                                    <View style={styles.input}>
                                        <Text>{gatilho.text}</Text>
                                    </View>
                                    <Icon
                                        style={styles.icon}
                                        name="minus"
                                        size={24}
                                        color={'red'}
                                        onPress={() => removeGatilho(gatilho.id)}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </Animatable.View>
                </Animatable.View>
                <View style={styles.divMenu}>
                    <Menu navigation={navigation} route={route} />
                </View>
            </View>
            :
            <View style={styles.container}>
                <View style={styles.divMain}>
                    <Animatable.Text
                        delay={400}
                        animation="fadeInLeft"
                        style={styles.h1}>Identificação de gatilhos</Animatable.Text>
                    <Animatable.Text
                        delay={400}
                        animation="fadeInLeft"
                        style={styles.h1}>O que são gatilhos?</Animatable.Text>

                    <Animatable.Text
                        delay={500}
                        animation="fadeInLeft" style={styles.texto}>
                        Gatilhos são situações, emoções ou eventos que podem desencadear o desejo de usar
                        substâncias novamente, levando à recaída.
                    </Animatable.Text>

                    <Animatable.Text
                        delay={600}
                        animation="fadeInLeft" style={styles.texto}>
                        Vamos definir algumas atividades?
                    </Animatable.Text>
                </View>
                <View style={styles.containerImg}>
                    <Animatable.Image
                        animation='flipInY'
                        source={require('../../../assets/gatilho.png')}
                        style={{ width: '100%' }}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.divButton}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={configurar}>
                        <Text style={styles.buttonText}>Adicionar novo risco</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.divMenu}>
                    <Menu navigation={navigation} route={route} />
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    divMain: {
        marginTop: 60,
        justifyContent: 'center',
    },
    h1: {
        marginLeft: 20,
        fontSize: 30,
        marginTop: 20,
        color: '#2C75B5',
        fontWeight: 'bold',
    },
    texto: {
        marginTop: 30,
        alignSelf: 'flex-start',
        fontSize: 20,
        paddingHorizontal: '5%'
    },
    containerImg: {
        marginTop: '10%'
    },
    divScroll: {
        maxHeight: 450,
        overflow: "hidden",
        borderRadius: 8,
    },
    divInput: {
        paddingHorizontal: '6%',
        marginTop: 25,
        position: 'relative',
        width: '100%'
    },
    input: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#C5C6CC',
        padding: '6%',
        height: 60,
        fontSize: 16,
    },
    icon: {
        padding: 15,
        position: 'absolute',
        top: 35,
        right: 20,
        transform: [{ translateY: -30 }],
    },
    divButton: {
        padding: '8%',
        marginTop: 50
    },
    button: {
        backgroundColor: '#006FFD',
        borderRadius: 15,
        width: '100%',
        padding: '4%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
    divMenu: {
        justifyContent: 'flex-end',
        flex: 1,
        marginBottom: 25,
        marginHorizontal: 10
    },
});
