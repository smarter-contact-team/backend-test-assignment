import { pubsub } from 'firebase-functions';
import { PubSub } from '@google-cloud/pubsub';
import { pubSubTopic } from './configs';

const pubSubClient = new PubSub();

export async function publishMessage(
  collectionName: string,
  data: Record<string, string>
) {
  try {
    const dataBufer = Buffer.from(JSON.stringify({...data, collectionName }));

    const messageId = await pubSubClient
      .topic(pubSubTopic)
      .publishMessage({ data: dataBufer });
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
    process.exitCode = 1;
  }
}

export function parsePubSubMessage(message: pubsub.Message): Record<string, string> | void {
  try {
    return JSON.parse(Buffer.from(message.data, 'base64').toString());
  } catch (error) {
    console.log(error);
  }
}
