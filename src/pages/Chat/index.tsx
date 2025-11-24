import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView 
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { onValue, push, ref } from "firebase/database";
import { database } from "../../services/firebase";
import { useUser } from "../../context/UserContext";

type Message = {
    id: string;
    text: string;
    user: string;
    timestamp: number;
};

export function Chat({ navigation }: any) {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const messagesRef = ref(database, 'messages');
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedMessages: Message[] = Object.keys(data)
                    .map(key => ({
                        id: key,
                        ...data[key]
                    }))
                    .sort((a, b) => a.timestamp - b.timestamp);
                setMessages(loadedMessages);
            } else {
                setMessages([]);
            }
        });
    }, []);

    const scrollToBottom = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            scrollToBottom();
        }, 100);

        return () => clearTimeout(timeout);
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim().length === 0) return;

        const messagesRef = ref(database, 'messages');
        push(messagesRef, {
            text: newMessage,
            user: user.name,
            timestamp: Date.now()
        });
        setNewMessage("");
    };

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        const isCurrentUser = item.user === user.name;
        const showUsername = index === 0 || messages[index - 1].user !== item.user;

        return (
            <View style={[
                styles.messageContainer,
                isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
            ]}>
                {showUsername && (
                    <Text style={[
                        styles.userName,
                        isCurrentUser ? styles.currentUserName : styles.otherUserName
                    ]}>
                        {item.user}
                    </Text>
                )}
                <View style={[
                    styles.messageBubble,
                    isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isCurrentUser ? styles.currentUserText : styles.otherUserText
                    ]}>
                        {item.text}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
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
                            value={newMessage}
                            onChangeText={setNewMessage}
                            multiline
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity 
                            style={styles.sendButton} 
                            onPress={handleSendMessage}
                            disabled={!newMessage.trim()}
                        >
                            <Text style={[
                                styles.sendButtonText,
                                !newMessage.trim() && styles.sendButtonDisabled
                            ]}>
                                Enviar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        padding: 4,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    avatarPlaceholder: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#E1E1E1',
        marginRight: 8,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
    },
    messagesList: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    messagesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    messageContainer: {
        marginVertical: 4,
        maxWidth: '80%',
    },
    currentUserMessage: {
        alignSelf: 'flex-end',
    },
    otherUserMessage: {
        alignSelf: 'flex-start',
    },
    userName: {
        fontSize: 12,
        marginBottom: 4,
    },
    currentUserName: {
        color: '#007AFF',
        textAlign: 'right',
    },
    otherUserName: {
        color: '#8E8E93',
    },
    messageBubble: {
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxWidth: '100%',
    },
    currentUserBubble: {
        backgroundColor: '#007AFF',
    },
    otherUserBubble: {
        backgroundColor: '#E9E9EB',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    currentUserText: {
        color: '#FFF',
    },
    otherUserText: {
        color: '#000',
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        backgroundColor: '#F2F2F7',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        maxHeight: 100,
        padding: 0,
        color: '#000',
    },
    sendButton: {
        marginLeft: 8,
        padding: 4,
    },
    sendButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    sendButtonDisabled: {
        color: '#C7C7CC',
    },
});

