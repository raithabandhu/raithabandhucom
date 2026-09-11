import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';

const products = [
  { lot: 'LOT-001', name: 'Urea 46%', icon: 'FlaskConical', desc: 'High-nitrogen granular fertiliser for rapid green growth.', category: 'Chemical', price: 1200 },
  { lot: 'LOT-002', name: 'DAP Fertiliser', icon: 'TestTube', desc: 'Di-Ammonium Phosphate for strong root development.', category: 'Chemical', price: 1800 },
  { lot: 'LOT-003', name: 'NPK 19-19-19', icon: 'Beaker', desc: 'Balanced macro-nutrient blend for all crop stages.', category: 'Chemical', price: 2200 },
  { lot: 'LOT-004', name: 'Organic Compost', icon: 'Recycle', desc: 'Natural bio-compost to enrich soil health sustainably.', category: 'Organic', price: 800 },
  { lot: 'LOT-005', name: 'Potassium Sulphate', icon: 'Atom', desc: 'Improves fruit quality and drought resistance in crops.', category: 'Chemical', price: 2600 },
  { lot: 'LOT-006', name: 'Vermicompost', icon: 'Layers', desc: 'Worm-processed organic matter for rich soil nutrition.', category: 'Organic', price: 950 },
];

export async function seedProducts() {
  const batch = writeBatch(db);
  products.forEach(p => batch.set(doc(collection(db, 'products')), p));
  await batch.commit();
  console.log('Products seeded!');
}
