import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const loginUser = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

export const registerUser = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

export const resetPassword = (email: string) =>
    sendPasswordResetEmail(auth, email);

export const logoutUser = () => signOut(auth);

export const onAuthChange = (cb: (user: User | null) => void) =>
    onAuthStateChanged(auth, cb);

// Naya helper — current logged-in user ka fresh ID token deta hai
export const getAuthToken = async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
};