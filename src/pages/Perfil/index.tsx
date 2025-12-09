"use client"

import { useEffect, useState, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Switch } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { useUser } from "../../context/UserContext"
import { UserReward } from "../../types/rewards"
import { db } from "../../services/firebase"
import { database } from "../../services/firebase";
import { onValue, ref } from "firebase/database";

import { collection, getDocs } from "firebase/firestore"


// notificações
import * as Notifications from "expo-notifications"

// CONFIGURAÇÃO OBRIGATÓRIA PARA ANDROID (senão vira alert)
Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.HIGH,
})

const { width } = Dimensions.get("window")

export function Perfil({ navigation }: any) {
    const { user, dadosUser } = useUser()
    const [notificationsEnabled, setNotificationsEnabled] = useState(false)
    const [userRewards, setUserRewards] = useState<UserReward[]>([])
    const notificationInterval = useRef<NodeJS.Timeout | null>(null)
    const notificationCount = useRef(0)

    const [atividades, setAtividades] = useState<any[]>([]);
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

    useEffect(() => {
        async function loadRewards() {
            if (user && user.uid) {
                try {
                    const rewardsRef = collection(db, "users", user.uid, "rewards")
                    const snapshot = await getDocs(rewardsRef)
                    const rewards = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        type: doc.data().type,
                        title: doc.data().title,
                        daysRequired: doc.data().daysRequired,
                        claimedAt: doc.data().claimedAt?.seconds || 0,
                        messageColor: doc.data().messageColor,
                        nameColor: doc.data().nameColor,
                        selectedMessageColor: doc.data().selectedMessageColor,
                    })) as UserReward[]
                    setUserRewards(rewards)
                } catch (error) {
                    console.error("[v0] Erro ao carregar recompensas:", error)
                }
            }
        }
        loadRewards()
    }, [user])

    const pedirPermissao = async () => {
        const { status } = await Notifications.requestPermissionsAsync()
        return status === "granted"
    }

    const toggleNotifications = async (value: boolean) => {
        if (!(await pedirPermissao())) return

        setNotificationsEnabled(value)

        if (value) {
            notificationCount.current = 0

            notificationInterval.current = setInterval(async () => {
                notificationCount.current++

                // Se não tiver atividades cadastradas, não tenta notificar
                if (!atividades || atividades.length === 0) {
                    console.log("Nenhuma atividade cadastrada ainda.")
                    return
                }

                // Sorteia uma atividade aleatória
                const randomAtividade =
                    atividades[Math.floor(Math.random() * atividades.length)]

                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: `Atividade #${notificationCount.current}`,
                        body: randomAtividade.text || "Atividade sem texto",
                    },
                    trigger: { channelId: "default" },
                })
            }, 5000)
        } else {
            if (notificationInterval.current) {
                clearInterval(notificationInterval.current)
                notificationInterval.current = null
                notificationCount.current = 0
            }
        }
    }

    const profileDecoration = userRewards.find((r) => r.type === "profile_decoration")

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="#2C75B5" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Perfil e Configurações</Text>
                </View>

                {/* Perfil */}
                <Animatable.View animation="fadeInUp" delay={200} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person-circle" size={24} color="#2C75B5" />
                        <Text style={styles.sectionTitle}>Informações do Perfil</Text>
                    </View>

                    <View style={styles.card}>
                        {profileDecoration && (
                            <View style={styles.decorationContainer}>
                                <Ionicons name="star" size={40} color="#FFD700" />
                                <View style={styles.decorationInfo}>
                                    <Text style={styles.decorationTitle}>Decoração de Perfil</Text>
                                    <Text style={styles.decorationText}>30 dias</Text>
                                </View>
                            </View>
                        )}

                        <View style={[styles.infoRow, profileDecoration && styles.infoRowWithDecoration]}>
                            <Text style={styles.infoLabel}>Nome:</Text>
                            <Text style={styles.infoValue}>{user?.name || dadosUser?.name || "Usuário"}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email:</Text>
                        </View>
                    </View>
                </Animatable.View>

                {/* Configurações */}
                <Animatable.View animation="fadeInUp" delay={400} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="settings" size={24} color="#2C75B5" />
                        <Text style={styles.sectionTitle}>Configurações</Text>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleInfo}>
                                <Text style={styles.toggleLabel}>Testar Notificações</Text>
                                <Text style={styles.toggleDescription}>Envia notificações a cada 5 segundos</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                                thumbColor={notificationsEnabled ? "#2C75B5" : "#f4f3f4"}
                                ios_backgroundColor="#D1D5DB"
                                onValueChange={toggleNotifications}
                                value={notificationsEnabled}
                            />
                        </View>
                    </View>
                </Animatable.View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
        marginTop: 10,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: width * 0.06,
        fontWeight: "800",
        color: "#2C75B5",
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: width * 0.05,
        fontWeight: "700",
        color: "#1F2937",
        marginLeft: 10,
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    decorationContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF9E6",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#FFD700",
    },
    decorationInfo: {
        marginLeft: 12,
        flex: 1,
    },
    decorationTitle: {
        fontSize: width * 0.04,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 4,
    },
    decorationText: {
        fontSize: width * 0.035,
        color: "#6B7280",
    },
    infoRow: {
        paddingVertical: 12,
    },
    infoRowWithDecoration: {
        paddingTop: 8,
    },
    infoLabel: {
        fontSize: width * 0.04,
        color: "#6B7280",
        marginBottom: 5,
        fontWeight: "600",
    },
    infoValue: {
        fontSize: width * 0.045,
        color: "#1F2937",
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 10,
    },
    testButton: {
        backgroundColor: "#2C75B5",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        borderRadius: 10,
        gap: 10,
    },
    testButtonText: {
        color: "#FFF",
        fontSize: width * 0.045,
        fontWeight: "700",
    },
    toggleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
    },
    toggleInfo: {
        flex: 1,
        marginRight: 15,
    },
    toggleLabel: {
        fontSize: width * 0.045,
        color: "#1F2937",
        fontWeight: "600",
        marginBottom: 4,
    },
    toggleDescription: {
        fontSize: width * 0.035,
        color: "#6B7280",
    },
})
