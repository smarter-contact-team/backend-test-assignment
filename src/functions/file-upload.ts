import { storage, logger } from 'firebase-functions';
import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { firestore, PubSubService } from '../services';
import { Document, isDocument } from '../types';

export const onFileUpload = storage
  .object()
  .onFinalize(async ({
    id: uploadId,
    name,
    bucket,
    kind,
    timeCreated,
  }) => {
    logger.info(`Uploaded file ${uploadId}`);

    const baseName = path.basename(name);
    const adminBucket = admin.storage().bucket(bucket);
    const tempFilePath = path.join(os.tmpdir(), baseName);

    await adminBucket
      .file(name)
      .download({
        destination: tempFilePath,
      });

    const fileString = fs.readFileSync(tempFilePath, 'utf8');
    const rows = fileString.split('\n');
    const headers = rows.at(0).split(',');

    if (!isDocument(headers)) {
      logger.warn('Unsupported document type');
      return;
    }

    const parsed = rows.slice(1).map((row) => row
      .split(',')
      .reduce((prev, value, i) => ({
        ...prev,
        [headers.at(i)]: value,
      }), {} as Document));

    await firestore()
      .collection('uploads')
      .doc(baseName)
      .set({
        filePath: name,
        kind,
        timeCreated,
        processed: false,
      });

    const pubSubService = new PubSubService();

    for (const document of parsed) {
      const { id } = await firestore()
        .collection('uploads')
        .doc(baseName)
        .collection('documents')
        .add(document);

      await pubSubService.sendMessage({
        uploadId: baseName,
        documentId: id,
        document,
      });
    }

    await firestore()
      .collection('uploads')
      .doc(baseName)
      .update({
        processed: true,
      });

    fs.unlinkSync(tempFilePath);
  });