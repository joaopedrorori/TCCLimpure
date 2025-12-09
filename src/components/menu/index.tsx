import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Menu = ({ navigation, route }: any) => {
    const [activePage, setActivePage] = useState<string>('Home');

    useEffect(() => {
        setActivePage(route.name);
    }, [route]);

    return (
        <View style={styles.menuContainer}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Recompensa')}
                style={styles.menuItem}
            >
                <Icon name="star" size={24} color={activePage === 'Recompensa' ? '#007AFF' : '#A0A0A0'} />
                <Text style={[styles.menuText, activePage === 'Recompensa' && styles.activeText]}>Recompensa</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Chat')}
                style={styles.menuItem}
            >
                <Icon name="comment" size={24} color={activePage === 'Chat' ? '#007AFF' : '#A0A0A0'} />
                <Text style={[styles.menuText, activePage === 'Chat' && styles.activeText]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                style={styles.menuItem}
            >
                <Icon name="home" size={24} color={activePage === 'Home' ? '#007AFF' : '#A0A0A0'} />
                <Text style={[styles.menuText, activePage === 'Home' && styles.activeText]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Atividades')}
                style={styles.menuItem}
            >
                <Icon name="running" size={24} color={activePage === 'Atividades' ? '#007AFF' : '#A0A0A0'} />
                <Text style={[styles.menuText, activePage === 'Atividades' && styles.activeText]}>Atividades</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Gatilhos')}
                style={styles.menuItem}
            >
                <Icon name="exclamation-circle" size={24} color={activePage === 'Gatilhos' ? '#007AFF' : '#A0A0A0'} />
                <Text style={[styles.menuText, activePage === 'Gatilhos' && styles.activeText]}>Gatilhos</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
                onPress={() => navigation.navigate('Mapa')}
                style={styles.menuItem}
            >
                <Icon name="map-marker-alt" size={24} color={activePage === 'Mapa' ? '#007AFF' : '#A0A0A0'} />
                <Text style={[styles.menuText, activePage === 'Mapa' && styles.activeText]}>Mapa</Text>
            </TouchableOpacity> */}
        </View>
    );
};

const styles = StyleSheet.create({
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    menuItem: {
        alignItems: 'center',
    },
    menuText: {
        marginTop: 7,
        fontSize: 12,
        color: '#A0A0A0',
    },
    activeText: {
        color: '#007AFF',
    },
});

export default Menu;
