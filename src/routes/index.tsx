import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignIn } from '../pages/SignIn';
import { Home } from '../pages/Home';
import { Register } from '../pages/Register/inicio';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { View } from 'react-native-animatable';
import { ActivityIndicator } from 'react-native';
import { Recompensa } from '../pages/Recompensa';
import { Chat } from '../pages/Chat';
import { Atividades } from '../pages/Atividades';
import { Gatilhos } from '../pages/Gatilhos';
import { Mapa } from '../pages/Mapa';
import { Tela2 } from '../pages/Register/tela2';
import { Tela3 } from '../pages/Register/tela3';
import { Tela4 } from '../pages/Register/tela4';
import { Tela5 } from '../pages/Register/tela5';
import { LojaRecompensa } from '../pages/Recompensa/LojaRecompensa';
import { Perfil } from '../pages/Perfil';

const Stack = createNativeStackNavigator();

type UserAuthPage = React.FC<{ navigation: any; route: any }>;

export default function Routes() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((_user) => {
            setUser(_user);
            if (initializing) {
                setInitializing(false);
            }
        });
        return unsubscribe;
    }, []);

    if (initializing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color='#1E90FF' />
            </View>
        );
    }

    let userAuthPage: UserAuthPage = SignIn;
    let userAuthName = 'SignIn';

    if (user) {
        userAuthPage = Home;
        userAuthName = 'Home';
    }

    return (
        <Stack.Navigator initialRouteName={user ? 'Home' : 'SignIn'}>
            <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Perfil"
                component={Perfil}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Recompensa"
                component={Recompensa}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LojaRecompensa"
                component={LojaRecompensa}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Atividades"
                component={Atividades}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Gatilhos"
                component={Gatilhos}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Mapa"
                component={Mapa}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Tela2"
                component={Tela2}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Tela3"
                component={Tela3}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Tela4"
                component={Tela4}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Tela5"
                component={Tela5}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
