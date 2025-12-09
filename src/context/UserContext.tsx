import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, database } from '../services/firebase';
import { ref, onValue } from 'firebase/database';

type UserType = {
    uid?: string;
    name?: string;
};

type DadosUser = {
    substance?: string;
    cleanDate: Date | null;
    reasons?: string[];
    trustedContactNumber?: string;
    trustedContactName?: string;
    name?: string;
    phone?: string;
    email?: string;
    gender?: string;
    terms?: boolean;
    communicationEmail?: boolean;
};

type UserContextType = {
    dadosUser: DadosUser;
    user: UserType;
    setDadosUser: (data: Partial<DadosUser>) => void;
    setUserLogado: (data: UserType) => void;
    estaConfigurado: boolean | null;
    estaConfiguradoGatilho: boolean | null;
};

type UserProviderProps = {
    children: React.ReactNode;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = (props: UserProviderProps) => {
    const [estaConfigurado, setEstaConfigurado] = useState<boolean | null>(null);
    const [estaConfiguradoGatilho, setEstaConfiguradoGatilho] = useState<boolean | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [dadosUser, setDados] = useState<DadosUser>({
        substance: '',
        cleanDate: null,
        reasons: [],
        trustedContactNumber: '',
        trustedContactName: '',
        name: '',
        phone: '',
        email: '',
        gender: '',
        terms: false,
        communicationEmail: false,
    });

    const setDadosUser = (data: Partial<DadosUser>) => {
        setDados((prev) => ({ ...prev, ...data }));
    };

    const setUserLogado = (data: UserType) => {
        setUser(data);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    uid: user.uid,
                    name: user.displayName || '',
                });

                setDadosUser({
                    email: user.email || '',
                });
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user && user.uid) {
            const estaConfiguradoRef = ref(database, `users/${user.uid}/estaConfigurado`);
            onValue(estaConfiguradoRef, (snapshot) => {
                setEstaConfigurado(snapshot.val());
            });

            return () => {
            };
        }
    }, [user]);

    useEffect(() => {
        if (user && user.uid) {
            const estaConfiguradoRef = ref(database, `users/${user.uid}/estaConfiguradoGatilho`);
            onValue(estaConfiguradoRef, (snapshot) => {
                setEstaConfiguradoGatilho(snapshot.val());
            });
            return () => {
            };
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ setUserLogado, user, dadosUser, setDadosUser, estaConfigurado, estaConfiguradoGatilho }}>
            {props.children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};
