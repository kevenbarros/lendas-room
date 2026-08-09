import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Config web do Firebase (mesmo projeto do painel financas-lendas). Estes
// valores são públicos por natureza; o acesso é controlado pelas regras do
// Firestore (a coleção rankingEntries/seasons tem leitura pública e escrita
// restrita à equipe).
const firebaseConfig = {
  apiKey: 'AIzaSyB9L2CZ_fF7Xzf9nBOG0LhLOVHGfCpcfPs',
  authDomain: 'lendas-financeira.firebaseapp.com',
  projectId: 'lendas-financeira',
  storageBucket: 'lendas-financeira.firebasestorage.app',
  messagingSenderId: '465287884904',
  appId: '1:465287884904:web:603b646bbd441bffb4cbdd',
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
