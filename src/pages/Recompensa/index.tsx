"use client"

import { useEffect, useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from "react-native"
import Menu from "../../components/menu"
import { useUser } from "../../context/UserContext"
import { database } from "../../services/firebase"
import { onValue, ref, push, remove } from "firebase/database"
import Icon from "react-native-vector-icons/FontAwesome5"

type Reward = {
    id: string
    dias: string
    text: string
}

export function Recompensa({ navigation, route }: any) {
    const [atividades, setAtividades] = useState<Reward[]>([])
    const [diasInput, setDiasInput] = useState<string>("")
    const [recompensaInput, setRecompensaInput] = useState<string>("")
    const { user } = useUser()

    useEffect(() => {
        if (user && user.uid) {
            const atividadesRef = ref(database, `users/${user.uid}/recompensas`)
            const unsubscribeAtividades = onValue(atividadesRef, (snapshot) => {
                const atividadesData = snapshot.val()
                if (atividadesData) {
                    const atividadesList = Object.entries(atividadesData).map(([id, data]: any) => ({
                        id,
                        dias: data.dias,
                        text: data.text,
                    }))
                    setAtividades(atividadesList)
                } else {
                    setAtividades([])
                }
            })

            return () => unsubscribeAtividades()
        }
    }, [user])

    async function handleAtividade() {
        if (user && user.uid && diasInput.trim() && recompensaInput.trim()) {
            if (isNaN(Number(diasInput)) || Number(diasInput) <= 0) {
                alert("Por favor, insira um número válido para os dias.")
                return
            }

            const dataEnviar = {
                dias: diasInput,
                text: recompensaInput,
            }
            const atividadesRef = ref(database, `users/${user.uid}/recompensas`)
            await push(atividadesRef, dataEnviar)
            setDiasInput("")
            setRecompensaInput("")
        }
    }

    function removeRasons(id: string) {
        if (user && user.uid) {
            const atividadeRef = ref(database, `users/${user.uid}/recompensas/${id}`)
            remove(atividadeRef)
                .then(() => {
                    setAtividades(atividades.filter((atividade) => atividade.id !== id))
                })
                .catch((error) => {
                    console.error("Erro ao remover atividade: ", error)
                })
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="chevron-left" size={24} color="#007AFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Sistema de premiação</Text>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.divMain}>
                        <Text style={styles.subtitle}>Vamos definir alguns prêmios</Text>
                    </View>

                    <View>
                        <Text style={styles.texto}>
                            A ideia é bem simples. Você irá estabelecer uma meta e fazer algo quando for batida. Ex: Após 2 dias
                            limpo, irei comer um chocolate.
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.storeButton} onPress={() => navigation.navigate("LojaRecompensa")}>
                        <View style={styles.storeButtonContent}>
                            <View>
                                <Text style={styles.storeButtonTitle}>Loja de Recompensas</Text>
                                <Text style={styles.storeButtonSubtitle}>Resgate recompensas exclusivas!</Text>
                            </View>
                            <Icon name="gift" size={24} color="#007AFF" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Após</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite a quantidade de dias"
                                placeholderTextColor="#999"
                                value={diasInput}
                                onChangeText={setDiasInput}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Irei</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Escreva o que você irá fazer"
                                placeholderTextColor="#999"
                                value={recompensaInput}
                                onChangeText={setRecompensaInput}
                            />
                        </View>

                        {atividades.map((atividade) => (
                            <View key={atividade.id} style={styles.rewardItem}>
                                <Text style={styles.rewardText}>
                                    Após <Text style={styles.highlightText}>{atividade.dias} dias</Text>
                                </Text>
                                <Text style={styles.rewardText}>
                                    Irei <Text style={styles.highlightText}>{atividade.text}</Text>
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleAtividade}>
                        <Text style={styles.buttonText}>Adicionar novo prêmio</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.divMenu}>
                    <Menu navigation={navigation} route={route} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
        marginLeft: 10,
    },
    scrollView: {
        flex: 1,
    },
    texto: {
        marginBottom: 30,
        alignSelf: "flex-start",
        fontSize: 20,
        paddingHorizontal: "5%",
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    divMain: {
        paddingHorizontal: 20,
    },
    subtitle: {
        fontSize: 28,
        color: "#007AFF",
        fontWeight: "bold",
        marginBottom: 24,
    },
    storeButton: {
        marginHorizontal: 20,
        marginBottom: 24,
        backgroundColor: "#F0F8FF",
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: "#007AFF",
    },
    storeButtonContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    storeButtonTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#007AFF",
        marginBottom: 4,
    },
    storeButtonSubtitle: {
        fontSize: 14,
        color: "#666",
    },
    formContainer: {
        paddingHorizontal: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E5E5",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: "#333",
    },
    rewardItem: {
        marginBottom: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },
    rewardText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 4,
    },
    highlightText: {
        color: "#007AFF",
        fontWeight: "500",
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#007AFF",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    divMenu: {
        backgroundColor: "#fff",
        marginBottom: -10,
        paddingHorizontal: 15,
    },
})
