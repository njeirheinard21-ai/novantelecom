import { UserRepository } from '../types';
import { UserProfile } from '../../types/user';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const store: Record<string, UserProfile> = {};

export const fixtureUserRepository: UserRepository = {
  async getProfile(uid: string) {
    await delay(150);
    return store[uid] || null;
  },
  async updateProfile(uid: string, patch: Partial<UserProfile>) {
    await delay(150);
    if (!store[uid]) throw new Error('User not found');
    store[uid] = { ...store[uid], ...patch, updatedAt: new Date().toISOString() };
    return store[uid];
  },
  async createProfile(uid: string, email: string) {
    await delay(150);
    const now = new Date().toISOString();
    store[uid] = { id: uid, email, createdAt: now, updatedAt: now };
    return store[uid];
  }
}
