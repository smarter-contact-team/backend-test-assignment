import { MultipartFile } from '@fastify/multipart';
import { Contact } from '../interfaces';

const csvToJSON = async (data: MultipartFile) => {
  try {
    const buffer = await data.toBuffer();
    const fileString = buffer.toString('utf8');

    const rows = fileString.split('\n');
    const headers = rows.at(0)?.replace('\r', '').split(',') ?? [];

    return [headers, rows.slice(1).map((row) => row
      .replace('\r', '')
      .split(',')
      .reduce((prev, value, i) => ({
        ...prev,
        [headers.at(i)?.toLowerCase() ?? '']: value,
      }), {} as Contact[]))];
  } catch (err) {
    throw new Error('Fail CSV file');
  }
};

export { csvToJSON };