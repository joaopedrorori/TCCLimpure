import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import * as Location from 'expo-location';
import Menu from "../../components/menu";

let MapView: any;
if (Platform.OS !== "web") {
    MapView = require("react-native-maps").default;
}

export function Mapa({ navigation, route }: any) {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Mapa de psicólogos</Text>
            <Text style={styles.h2}>
                Buscar ajuda é um grande passo para a vitória.
                No mapa abaixo você pode ver psicólogos próximos a sua localização atual.
            </Text>
            <View style={styles.mapContainer}>
                {Platform.OS === "web" ? (
                    <iframe
                        title="Mapa de psicólogos"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!..." // Coloque o link correto do Google Maps
                        style={{ width: "100%", height: "100%", border: 0 }}
                    />
                ) : location ? (
                    <MapView
                        style={StyleSheet.absoluteFill}
                        initialRegion={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.035,
                            longitudeDelta: 0.035
                        }}
                    />
                ) : (
                    <Text>{errorMsg || 'Carregando mapa...'}</Text>
                )}
            </View>
            <View style={styles.divMenu}>
                <Menu navigation={navigation} route={route} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    mapContainer: { flex: 1 },
    h1: { marginTop: 50, marginLeft: 35, color: '#2C75B5', fontSize: 25, fontWeight: 'bold' },
    h2: { marginTop: 20, marginBottom: 20, marginLeft: 35, fontSize: 20 },
    divMenu: { justifyContent: 'flex-end', marginBottom: 25, marginHorizontal: 10 },
});
