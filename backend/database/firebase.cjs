// Firestore config and detection storage (CommonJS)
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const firebaseConfig = {
  credential: applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
