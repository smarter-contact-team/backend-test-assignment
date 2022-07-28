import axios from 'axios';
import { VeriResponse } from '../interfaces';

const validatePhone = async (phone: string) => {
  if (!process.env.VERIPHONE_URL || !process.env.VERIPHONE_API_KEY) {
    throw new Error();
  }

  return axios.get<VeriResponse>(process.env.VERIPHONE_URL, {
    params: {
      key: process.env.VERIPHONE_API_KEY,
      phone: phone,
    },
  });
};

export default validatePhone;
