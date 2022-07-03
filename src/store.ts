import { getFirestore } from "firebase-admin/firestore";
import { publishMessage } from "./pubSub";
import { verifyPhoneNumber } from "./utils";

export async function writeDocumentsToStore(
  collectionName: string,
  data: Record<string, string>[],
) {
  const db = getFirestore();
  
  data.map((contact) => {
    db.collection(collectionName).doc(contact.Name).set(contact);
    publishMessage(collectionName, contact);
  });
}

export async function updateDocument(
  collectionName: string,
  data: Record<string, string>,
) {
  const db = getFirestore();

  const doc = db.collection(collectionName).doc(data.Name);

  const verifiedData = await verifyPhoneNumber(data);

  await doc.set(verifiedData);

  if (await checkValidationDocuments(collectionName)) {
    createProcessedDocument(collectionName);
  }
}

export async function checkValidationDocuments(collectionName: string): Promise<boolean> {
  const db = getFirestore();

  const queryResult = await db.collection(collectionName).get();

  return queryResult.docs.every((doc) => Object.prototype.hasOwnProperty.call(doc.data(), 'IsValid'));
}

export function createProcessedDocument(collectionName: string) {
  const db = getFirestore();

  db.collection(collectionName).doc('Processed').set({ finished: true });
}
