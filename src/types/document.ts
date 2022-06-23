const document = ['Name', 'Email', 'Phone'] as const;

export type Document = Record<typeof document[number], string>;

export const isDocument = (headers: string[]) => JSON.stringify(headers) === JSON.stringify(document);
