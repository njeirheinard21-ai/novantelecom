import { ProductRepository, CategoryRepository, BrandRepository, SettingsRepository, UserRepository } from './types';
import { firestoreProductRepository } from './firestore/productRepository';
import { firestoreCategoryRepository } from './firestore/categoryRepository';
import { firestoreBrandRepository } from './firestore/brandRepository';
import { firestoreSettingsRepository } from './firestore/settingsRepository';
import { firestoreUserRepository } from './firestore/userRepository';

export const productRepository: ProductRepository = firestoreProductRepository;
export const categoryRepository: CategoryRepository = firestoreCategoryRepository;
export const brandRepository: BrandRepository = firestoreBrandRepository;
export const settingsRepository: SettingsRepository = firestoreSettingsRepository;
export const userRepository: UserRepository = firestoreUserRepository;

export * from './types';
