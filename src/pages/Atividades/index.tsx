import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import Menu from "../../components/menu";
import { useUser } from "../../context/UserContext";
import { database } from "../../services/firebase";
import { onValue, ref, push, remove, set } from "firebase/database";
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome5';

export function Atividades({ navigation, route }: any) {
    const [atividades, setAtividades] = useState<any[]>([]);
    const [input, setInput] = useState<string>('');
    const { user, estaConfigurado } = useUser();

    useEffect(() => {
        if (user && user.uid) {
            const atividadesRef = ref(database, `users/${user.uid}/atividades`);
            const unsubscribeAtividades = onValue(atividadesRef, (snapshot) => {
                const atividadesData = snapshot.val();
                if (atividadesData) {
                    const atividadesList = Object.entries(atividadesData).map(([id, text]) => ({ id, text }));
                    setAtividades(atividadesList);
                } else {
                    setAtividades([]);
                }
            });

            return () => unsubscribeAtividades();
        }
    }, [user]);

    function configurar() {
        if (user && user.uid) {
            set(ref(database, `users/${user.uid}/estaConfigurado`), true);
        } else {
            console.error("Usuário não autenticado.");
        }
    }

    async function handleAtividade() {
        if (user && user.uid && input.trim()) {
            const atividadesRef = ref(database, `users/${user.uid}/atividades`);
            const newAtividadeRef = await push(atividadesRef, input);
            setInput('');
        }
    }

    function removeAtividade(id: string) {
        if (user && user.uid) {
            const atividadeRef = ref(database, `users/${user.uid}/atividades/${id}`);
            remove(atividadeRef)
                .catch((error) => {
                    console.error("Erro ao remover atividade: ", error);
                });
        }
    }

    return (
        estaConfigurado
            ? <View style={styles.container}>
                <View style={styles.divMain}>
                    <Animatable.Text
                        delay={400}
                        animation="fadeInLeft"
                        style={styles.h1}>Definindo atividades</Animatable.Text>
                    <Animatable.Text
                        delay={500}
                        animation="fadeInLeft"
                        style={styles.texto}>
                        Defina abaixo atividades que você
                        possa realizar durante o dia para
                        se distrair. Recomendamos principalmente
                        atividades físicas como uma corrida ou caminhada.
                    </Animatable.Text>
                </View>
                <Animatable.View animation="fadeInLeft" delay={600}>
                    <View style={styles.divInput}>
                        <TextInput
                            style={styles.input}
                            placeholder="Adicionar atividade"
                            value={input}
                            onChangeText={setInput}
                        />
                        <Icon
                            style={styles.icon}
                            name="plus"
                            size={24}
                            color={'#007AFF'}
                            onPress={handleAtividade}
                        />
                    </View>

                    <Animatable.View animation="fadeInLeft" delay={600} style={styles.divScroll}>
                        <ScrollView>
                            {atividades.map((atividade) => (
                                <View style={styles.divInput} key={atividade.id}>
                                    <View style={styles.input}>
                                        <Text>{atividade.text}</Text>
                                    </View>
                                    <Icon
                                        style={styles.icon}
                                        name="minus"
                                        size={24}
                                        color={'red'}
                                        onPress={() => removeAtividade(atividade.id)}
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
                        style={styles.h1}>Atividades de Distração</Animatable.Text>

                    <Animatable.Text
                        delay={500}
                        animation="fadeInLeft" style={styles.texto}>
                        Atividades de distração são ótimas
                        alternativas para passar o tempo
                        e manter sua cabeça longe do vício.
                        Atividades físicas, por exemplo, liberam endorfina,
                        o hormônio do prazer.
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
                        source={require('../../../assets/imgAtividade.png')}
                        style={{ width: '100%' }}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.divButton}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={configurar}>
                        <Text style={styles.buttonText}>Configurar</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    h1: {
        fontSize: 30,
        marginTop: 50,
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
