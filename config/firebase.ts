import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyAdGIlsi1YSFQdJm59ahkWOSb3KGxojN_c",
    authDomain: "deepfake-d9bf8.firebaseapp.com",
    projectId: "deepfake-d9bf8",
    storageBucket: "deepfake-d9bf8.firebasestorage.app",
    messagingSenderId: "876045078740",
    appId: "1:876045078740:web:8f52b21bcf872e0a686b41"
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