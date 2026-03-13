// Detection model for Firestore (CommonJS)
const db = require('../database/firebase.cjs');

const COLLECTION = 'detections';

exports.saveDetection = async (data) => {
  await db.collection(COLLECTION).add(data);
};

exports.getHistory = async () => {
  const snapshot = await db.collection(COLLECTION).orderBy('timestamp', 'desc').limit(50).get();
  return snapshot.docs.map(doc => doc.data());
};
