import { Document } from './document'

export type Message = {
  uploadId: string;
  documentId: string;
  document: Document;
}
