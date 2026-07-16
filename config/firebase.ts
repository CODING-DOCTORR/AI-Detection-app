import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyAar-4AYKxdOJBZ4Eakn45Noui-raV9IKg",
    authDomain: "deepfake-detector-3958e.firebaseapp.com",
    projectId: "deepfake-detector-3958e",
    storageBucket: "deepfake-detector-3958e.firebasestorage.app",
    messagingSenderId: "150605444180",
    appId: "1:150605444180:web:4c7b3932528709582129c1"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// @ts-ignore
const { getReactNativePersistence } = require('firebase/auth');

let authInstance: Auth;
try {
    authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
} catch (error) {
    authInstance = getAuth(app);
}

export const auth = authInstance;