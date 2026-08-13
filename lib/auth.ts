import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, sendPasswordResetEmail, onIdTokenChanged, User } from 'firebase/auth';
import { app } from './firebase';

export const auth = getAuth(app);

export const loginWithEmail = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
export const registerWithEmail = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);
export const onTokenChanged = (callback: (user: User | null) => void) => onIdTokenChanged(auth, callback);
export type { User };
