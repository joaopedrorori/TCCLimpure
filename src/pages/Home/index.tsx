import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Linking, ScrollView, SafeAreaView, Dimensions } from "react-native";
import * as Animatable from 'react-native-animatable';
import { db } from "../../services/firebase";
import Menu from "../../components/menu";
import { useUser } from "../../context/UserContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons"
import { database } from "../../services/firebase";
import { onValue, ref } from "firebase/database";
import * as Notifications from "expo-notifications";

const { width, height } = Dimensions.get('window');

export function Home({ navigation, route }: any) {
    const { user, dadosUser } = useUser();
    const [dadosBanco, setDadosBanco] = useState<any>();
    const [formattedDuration, setFormattedDuration] = useState<string>("");
    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [atividades, setAtividades] = useState<any[]>([]);

    useEffect(() => {
        if (!user?.uid) return;
        const atividadesRef = ref(database, `users/${user.uid}/atividades`);
        const unsubscribe = onValue(atividadesRef, snapshot => {
            const data = snapshot.val();
            if (data) {
                const list = Object.entries(data).map(([id, text]) => ({ id, text }));
                setAtividades(list);
            } else {
                setAtividades([]);
            }
        });
        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (atividades.length === 0) return;
        Notifications.cancelAllScheduledNotificationsAsync();
        const id = setInterval(() => {
            const random = atividades[Math.floor(Math.random() * atividades.length)];

            Notifications.scheduleNotificationAsync({
                content: {
                    title: "Uma atividade pra você agora",
                    body: random.text,
                    sound: true,
                },
                trigger: null
            });
        }, 5000);
        return () => clearInterval(id);
    }, [atividades]);

    useEffect(() => {
        async function handleBanco() {
            if (user && user.uid) {
                try {
                    const userRef = doc(db, "users", user.uid);
                    const dadosBanco = await getDoc(userRef);
                    if (dadosBanco.exists()) {
                        setDadosBanco(dadosBanco.data());
                    }
                } catch (error) {
                    console.error("Erro ao buscar dados do banco:", error);
                }
            }
        }
        handleBanco();
    }, [user, modal2]);

    useEffect(() => {
        if (dadosBanco && dadosBanco.cleanDate) {
            const date = new Date((dadosBanco.cleanDate.seconds * 1000) + Math.floor(dadosBanco.cleanDate.nanoseconds / 1000000));
            const now = new Date();
            const durationInMilliseconds = now.getTime() - date.getTime();
            const seconds = Math.floor(durationInMilliseconds / 1000);
            const hours = Math.floor(seconds / 3600);
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;
            setFormattedDuration(`${days}D : ${remainingHours}hrs`);
        }
    }, [dadosBanco]);

    function HandleModal() {
        setModal(true);
    }
    function closeModal() {
        setModal(false);
    }

    function handleModal2() {
        setModal2(true)
    }
    function closetModal2() {
        setModal2(false)
    }
    function handleNavigateToProfile() {
        navigation.navigate("Perfil")
    }

    async function handleReset() {
        if (user && user.uid) {
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    cleanDate: new Date(),
                });
                setModal2(false);
            } catch (error) {
                console.error("Erro ao resetar o tempo:", error);
            }
        }
    }

    const makePhoneCall = () => {
        const phoneNumber = 'tel:+5561983700857';
        Linking.openURL(phoneNumber).catch((err) =>
            console.error('Erro ao tentar fazer a ligação', err)
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerContainer}>
                    <Animatable.View animation="fadeInLeft" delay={500} style={styles.divH1Name}>
                        <Text style={styles.h1Name}>Olá,</Text>
                        <Text style={styles.h1Name}>{user?.name ? user.name : dadosUser.name}</Text>
                    </Animatable.View>

                    <Animatable.View animation="fadeInRight" delay={500}>
                        <TouchableOpacity style={styles.profileButton} onPress={handleNavigateToProfile}>
                            <Ionicons name="person-circle" size={50} color="#2C75B5" />
                        </TouchableOpacity>
                    </Animatable.View>
                </View>

                <Animatable.View animation="fadeInUp" style={styles.contentContainer}>
                    <View style={styles.divH23}>
                        <Text style={styles.h2}>Você está há</Text>
                        <Text style={styles.h3}>{formattedDuration}</Text>
                        <Text style={styles.h2}>Limpo</Text>
                    </View>

                    <Animatable.View
                        animation="flipInY"
                        delay={500}
                    >
                        <TouchableOpacity
                            style={styles.button}
                            onPress={HandleModal}
                        >
                            <Text style={styles.textButton}>Botão de</Text>
                            <Text style={styles.textButton}>emergência</Text>
                        </TouchableOpacity>
                    </Animatable.View>

                    <Animatable.View
                        animation="flipInY"
                        delay={500}
                    >
                        <TouchableOpacity
                            style={styles.btnReset}
                            onPress={handleModal2}
                        >
                            <Text>Resetar tempo</Text>
                        </TouchableOpacity>
                    </Animatable.View>

                    <View style={styles.divMessage}>
                        <Text style={styles.message}>"Não desista! Quanto mais escura a
                            noite, mais brilhante são as estrelas"</Text>
                        <Text style={styles.message}>-Braum</Text>
                    </View>
                </Animatable.View>
            </ScrollView>

            <View style={styles.divMenu}>
                <Menu navigation={navigation} route={route} />
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modal}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Lembre-se dos motivos da sua luta</Text>
                        <Text style={styles.modalText}>
                            <Text style={styles.boldText}>Melhorar sua saúde</Text> é um dos motivos que você nos deu.
                            Já veio até aqui nessa luta, não desista agora,
                            distraia sua mente, pratique um esporte, leia um livro.
                        </Text>

                        <View style={styles.divButtonModal}>
                            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                                <Text style={styles.buttonText}>Voltar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={makePhoneCall}
                            >
                                <Text style={styles.buttonText}>Ligar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <Modal
                animationType="fade"
                transparent={true}
                visible={modal2}
                onRequestClose={closetModal2}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Não desista por um deslize</Text>
                        <Text style={styles.modalText}>
                            <Text style={styles.boldText}>Continue persistindo. </Text>
                            Nao deixe que um deslize acabe com sua luta, os frutos colhidos
                            la na frente valerao a pena.
                        </Text>

                        <View style={styles.divButtonModal}>
                            <TouchableOpacity onPress={closetModal2} style={styles.modalButton}>
                                <Text style={styles.buttonText}>Voltar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalButton2}
                                onPress={handleReset}
                            >
                                <Text style={styles.buttonText}>Resetar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "10%",
        marginBottom: "5%",
    },
    profileButton: {
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        flexGrow: 1,
        padding: '5%',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    divH1Name: {
        marginTop: '5%',
    },
    h1Name: {
        fontSize: width * 0.1,
        fontWeight: '800',
        color: '#2C75B5'
    },
    divH23: {
        marginTop: '5%',
        alignItems: 'center'
    },
    h2: {
        marginVertical: '2%',
        color: '#2C75B5',
        fontSize: width * 0.07,
        fontWeight: '800'
    },
    h3: {
        color: '#333',
        fontWeight: '800',
        fontSize: width * 0.1
    },
    button: {
        borderRadius: 999,
        alignSelf: 'center',
        height: width * 0.4,
        width: width * 0.4,
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
        fontSize: width * 0.05,
        fontWeight: 'bold'
    },
    divMessage: {
        marginTop: '5%',
        paddingHorizontal: '5%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    message: {
        color: '#333',
        fontSize: width * 0.05,
        fontWeight: '500',
        textAlign: 'center',
    },
    divMenu: {
        justifyContent: 'flex-end',
        marginHorizontal: 10
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.9,
        maxWidth: 350,
        padding: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        paddingHorizontal: 15,
        fontSize: width * 0.06,
        color: '#2C75B5',
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 15,
        textAlign: 'center',
    },
    modalText: {
        fontSize: width * 0.045,
        paddingHorizontal: 20,
        marginVertical: 12,
        color: '#333',
        textAlign: 'center',
    },
    divButtonModal: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    modalButton: {
        padding: 15,
        backgroundColor: '#006FFD',
        borderRadius: 15,
        width: '42%',
        marginTop: 10,
        marginBottom: 20
    },
    modalButton2: {
        backgroundColor: '#f20a0a',
        padding: 15,
        borderRadius: 15,
        width: '42%',
        marginTop: 10,
        marginBottom: 20
    },
    buttonText: {
        color: 'white',
        fontSize: width * 0.04,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    boldText: {
        fontWeight: 'bold',
    },
    btnReset: {
        borderRadius: 15,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#006FFD',
        borderWidth: 2,
        paddingHorizontal: 20,
        paddingVertical: 5,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        marginTop: '5%'
    }
});