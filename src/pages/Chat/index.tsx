"use client"

import { useEffect, useState, useRef } from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { onValue, push, ref } from "firebase/database"
import { collection, getDocs, onSnapshot } from "firebase/firestore"
import { database, db } from "../../services/firebase"
import { useUser } from "../../context/UserContext"
import type { UserReward } from "../../types/rewards"

type Message = {
    id: string
    text: string
    user: string
    timestamp: number
    uid: string
}

export function Chat({ navigation }: any) {
    const { user } = useUser()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [userRewards, setUserRewards] = useState<Map<string, UserReward[]>>(new Map())
    const flatListRef = useRef<FlatList>(null)

    useEffect(() => {
        if (!user || !user.uid) return

        const rewardsRef = collection(db, "users", user.uid, "rewards")
        const unsubscribe = onSnapshot(rewardsRef, (snapshot) => {
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

            const newMap = new Map(userRewards)
            if (user.uid) {
                newMap.set(user.uid, rewards)
            }
            setUserRewards(newMap)
        })

        return () => unsubscribe()
    }, [user])

    useEffect(() => {
        const messagesRef = ref(database, "messages")
        onValue(messagesRef, async (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const loadedMessages: Message[] = Object.keys(data)
                    .map((key) => ({
                        id: key,
                        text: data[key].text,
                        timestamp: data[key].timestamp,
                        uid: data[key].uid,
                        user: data[key].user || "Usuário",
                    }))
                    .sort((a, b) => a.timestamp - b.timestamp)

                setMessages(loadedMessages)

                const uniqueUids = new Set(loadedMessages.map((m) => m.uid))
                const rewardsMap = new Map(userRewards)

                for (const uid of uniqueUids.values()) {
                    if (!rewardsMap.has(uid)) {
                        try {
                            const rewardsRef = collection(db, "users", uid, "rewards")
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

                            rewardsMap.set(uid, rewards)
                        } catch (e) {
                            console.log("Erro ao pegar reward:", e)
                        }
                    }
                }

                setUserRewards(rewardsMap)
            } else {
                setMessages([])
            }
        })
    }, [])

    const scrollToBottom = () => {
        flatListRef.current?.scrollToEnd({ animated: true })
    }

    useEffect(() => {
        setTimeout(scrollToBottom, 100)
    }, [messages])

    const handleSendMessage = () => {
        if (!newMessage.trim()) return

        const displayName = user?.name || "Usuário"

        const messagesRef = ref(database, "messages")
        push(messagesRef, {
            text: newMessage,
            user: displayName,
            uid: user.uid,
            timestamp: Date.now(),
        })

        setNewMessage("")
    }

    const getMessageStyles = (uid: string) => {
        const rewards = userRewards.get(uid) || []

        return {
            messageColor: rewards.find((r) => r.type === "change_message_color")?.selectedMessageColor,
            nameColor: rewards.find((r) => r.type === "change_name_color")?.nameColor,
            isHighlighted: !!rewards.find((r) => r.type === "highlight_message"),
        }
    }

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        const isCurrentUser = item.uid === user.uid
        const showUsername = index === 0 || messages[index - 1].user !== item.user
        const { messageColor, nameColor, isHighlighted } = getMessageStyles(item.uid)

        return (
            <View
                style={[
                    styles.messageContainer,
                    isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
                    isHighlighted && styles.highlightedContainer,
                ]}
            >
                {showUsername && (
                    <Text
                        style={[
                            styles.userName,
                            isCurrentUser ? styles.currentUserName : styles.otherUserName,
                            nameColor && { color: nameColor },
                        ]}
                    >
                        {item.user}
                    </Text>
                )}

                <View
                    style={[
                        styles.messageBubble,
                        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
                        messageColor && { backgroundColor: messageColor },
                    ]}
                >
                    <Text
                        style={[
                            styles.messageText,
                            isCurrentUser ? styles.currentUserText : styles.otherUserText,
                            messageColor && { color: "#FFF" },
                        ]}
                    >
                        {item.text}
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="chevron-left" size={28} color="#007AFF" />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <View style={styles.avatarPlaceholder} />
                        <Text style={styles.title}>Grupo de Chat</Text>
                    </View>
                </View>

                <FlatList
                    ref={flatListRef}
                    style={styles.messagesList}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messagesContainer}
                />

                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Mensagem"
                            placeholderTextColor="#999"
                            value={newMessage}
                            onChangeText={setNewMessage}
                            multiline
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} disabled={!newMessage.trim()}>
                            <Text style={[styles.sendButtonText, !newMessage.trim() && styles.sendButtonDisabled]}>Enviar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },
    backButton: {
        padding: 6,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },
    avatarPlaceholder: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#E1E1E1",
        marginRight: 8,
    },
    title: {
        fontSize: 17,
        fontWeight: "600",
        color: "#000",
    },
    messagesList: {
        flex: 1,
        backgroundColor: "#F2F2F7",
    },
    messagesContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        paddingBottom: 20,
    },
    messageContainer: {
        marginVertical: 4,
        maxWidth: "85%",
        paddingHorizontal: 2,
    },
    currentUserMessage: {
        alignSelf: "flex-end",
    },
    otherUserMessage: {
        alignSelf: "flex-start",
    },
    highlightedContainer: {
        padding: 4,
        borderRadius: 14,
        backgroundColor: "#FFF9E6",
        borderWidth: 2,
        borderColor: "#FFD700",
    },
    userName: {
        fontSize: 12,
        marginBottom: 4,
    },
    currentUserName: {
        color: "#007AFF",
        textAlign: "right",
    },
    otherUserName: {
        color: "#8E8E93",
    },
    messageBubble: {
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        overflow: "hidden",
    },
    currentUserBubble: {
        backgroundColor: "#007AFF",
    },
    otherUserBubble: {
        backgroundColor: "#E9E9EB",
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    currentUserText: {
        color: "#FFF",
    },
    otherUserText: {
        color: "#000",
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: "#E5E5E5",
        backgroundColor: "#F2F2F7",
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 24,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === "android" ? 10 : 10,
        marginBottom: Platform.OS === "android" ? 20 : 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        maxHeight: 120,
        color: "#000",
        paddingTop: 0,
        paddingBottom: 0,
    },
    sendButton: {
        marginLeft: 10,
        padding: 4,
    },
    sendButtonText: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "600",
    },
    sendButtonDisabled: {
        color: "#C7C7CC",
    },
})
