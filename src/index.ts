import * as functions from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import axios from 'axios';
import { csv2Obj } from './utils';
import { updateDocument, writeDocumentsToStore } from './store';
import { parsePubSubMessage } from './pubSub';
import { pubSubTopic } from './configs';

initializeApp();

export const storageUploadListener = functions.storage
  .object()
  .onFinalize(async (obj: functions.storage.ObjectMetadata) => {
      const response = await axios.get(obj.mediaLink);
      const parsedData = csv2Obj(response.data);

      await writeDocumentsToStore(obj.name, parsedData);
  });

export const createDocument = functions.pubsub.topic(pubSubTopic).onPublish((message: functions.pubsub.Message) => {
  const messageData: Record<string, string> | void = parsePubSubMessage(message);

  if (!messageData) throw new Error('Something went wrong');

  const { collectionName, ...data } = messageData;

  updateDocument(collectionName, data);
});
