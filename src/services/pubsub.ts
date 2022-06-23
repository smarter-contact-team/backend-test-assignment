import { PubSub } from "@google-cloud/pubsub";
import { logger } from 'firebase-functions';
import { env } from '../config';
import { Message } from '../types';

export class PubSubService {
  private readonly client: PubSub;

  constructor({ pubSub = new PubSub() } = {}) {
    this.client = pubSub ?? new PubSub();
  }

  async sendMessage(json: Message): Promise<string> {
    logger.info('PubSubService::sendMessage', json);

    const topic = this.client.topic(env.topicName);
    return topic.publishMessage({
      json,
    });
  }
}
