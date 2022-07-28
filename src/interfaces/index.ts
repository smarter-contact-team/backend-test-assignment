export interface VeriResponse {
  phone_valid: boolean;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  isValid: boolean;
}