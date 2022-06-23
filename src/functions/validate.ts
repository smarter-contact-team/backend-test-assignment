import { env } from '../config';
import { pubsub } from 'firebase-functions';
import axios from 'axios';
import { firestore } from '../services';

export const onValidate = pubsub
  .topic(env.topicName)
  .onPublish(async ({ json }) => {
    const res = await axios.get(env.veriphone.apiUrl, {
      params: {
        key: env.veriphone.apiKey,
        phone: json.document.Phone,
      }
    });

    await firestore()
      .collection('uploads')
      .doc(json.uploadId)
      .collection('documents')
      .doc(json.documentId)
      .update({
        Valid: !!res.data?.phone_valid,
      });
  });
