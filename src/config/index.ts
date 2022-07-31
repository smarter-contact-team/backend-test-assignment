import 'dotenv/config';

export const PORT = parseInt(process.env.PORT || '') || 8090;
export const VERIPHONE_URL = process.env.VERIPHONE_URL || '';
export const VERIPHONE_API_KEY = process.env.VERIPHONE_API_KEY || '';