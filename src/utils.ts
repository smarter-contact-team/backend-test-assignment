import axios from "axios";
import { veriphoneKey } from "./configs";

type VeriphoneResponse = {
  status: string
  phone: string
  phone_valid: boolean
  phone_type: string
  phone_region: string
  country: string
  country_code: string
  country_prefix: string
  international_number: string
  local_number: string
  e164: string
  carrier: string
}

export function csv2Obj(csv: string): Record<string, string>[] {
  const rows = csv.split('\n').map((row) => row.trim());
  const headers = rows.shift().split(',');

  return rows.map((row) => {
    const values = row.split(',');
    const res: Record<string, string> = {};

    headers.forEach((header, index) => {
      res[header] = values[index];
    });

    return res;
  });
}

export async function verifyPhoneNumber(
  doc: Record<string, string>
): Promise<Record<string, string | boolean>> {
  const IsValid = await requestVerification(doc.Phone);

  return { ...doc, IsValid }
}

export async function requestVerification(phone: string): Promise<boolean> {
  const url = `https://api.veriphone.io/v2/verify?key=${veriphoneKey}&phone=${phone}`;
  const resp = await axios.get<VeriphoneResponse>(url);

  if (resp.status !== 200) return false;

  return resp.data.phone_valid;
}
