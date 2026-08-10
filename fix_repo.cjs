const fs = require('fs');

let types = fs.readFileSync('src/data/types.ts', 'utf8');
types = types.replace(
  /setActive\(id: string, isActive: boolean\): Promise<void>;/,
  'setActive(id: string, isActive: boolean): Promise<void>;\n  search(query: string, limit?: number): Promise<Product[]>;\n  delete(id: string): Promise<void>;'
);
fs.writeFileSync('src/data/types.ts', types);

let fsRepo = fs.readFileSync('src/data/firestore/productRepository.ts', 'utf8');
fsRepo = fsRepo.replace(/export const firestoreProductRepository: ProductRepository = \{/, 'export const firestoreProductRepository: ProductRepository = {\n  async search(queryStr: string, limitCount?: number): Promise<Product[]> {\n    return this.list({ search: queryStr, limit: limitCount || 20 }).then(res => res.items);\n  },\n  async delete(id: string): Promise<void> {\n    const { deleteDoc, doc } = require("firebase/firestore");\n    await deleteDoc(doc(require("../../lib/firebase").db, "products", id));\n  },');
fs.writeFileSync('src/data/firestore/productRepository.ts', fsRepo);

let fixRepo = fs.readFileSync('src/data/fixtures/productRepository.ts', 'utf8');
fixRepo = fixRepo.replace(/export const fixtureProductRepository: ProductRepository = \{/, 'export const fixtureProductRepository: ProductRepository = {\n  async search(queryStr: string, limitCount?: number): Promise<Product[]> {\n    return this.list({ search: queryStr, limit: limitCount || 20 }).then(res => res.items);\n  },\n  async delete(id: string): Promise<void> {\n    const index = store.findIndex(p => p.id === id);\n    if (index > -1) store.splice(index, 1);\n  },');
fs.writeFileSync('src/data/fixtures/productRepository.ts', fixRepo);

