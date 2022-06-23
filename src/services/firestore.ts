import * as admin from 'firebase-admin';

admin.initializeApp();

let db: FirebaseFirestore.Firestore | undefined;

export const firestore = () => {
    if (db === undefined) {
        db = admin.firestore();
    }
    return db;
}
