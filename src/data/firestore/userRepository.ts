import { UserRepository } from '../types';
import { UserProfile } from '../../types/user';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { fromFirestoreDate } from './utils';

export const firestoreUserRepository: UserRepository = {
  async getProfile(uid: string) {
    const d = await getDoc(doc(db, 'users', uid));
    if (!d.exists()) return null;
    const data = d.data() as any;
    return {
      ...data,
      id: d.id,
      createdAt: fromFirestoreDate(data.createdAt),
      updatedAt: fromFirestoreDate(data.updatedAt)
    } as UserProfile;
  },
  
  async updateProfile(uid: string, patch: Partial<UserProfile>) {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...patch,
      updatedAt: serverTimestamp()
    });
    const d = await getDoc(docRef);
    const data = d.data() as any;
    return {
      ...data,
      id: d.id,
      createdAt: fromFirestoreDate(data.createdAt),
      updatedAt: fromFirestoreDate(data.updatedAt)
    } as UserProfile;
  },

  async createProfile(uid: string, email: string) {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, {
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    const d = await getDoc(docRef);
    const data = d.data() as any;
    return {
      ...data,
      id: d.id,
      createdAt: fromFirestoreDate(data.createdAt),
      updatedAt: fromFirestoreDate(data.updatedAt)
    } as UserProfile;
  }
}
