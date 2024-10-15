import { v4 as uuidv4 } from 'uuid';

export interface Patient {
  patientId: string;
  name: string;
  address: string;
  conditions: string[];
  allergies: string[];
}

export function createPatient(
  name: string,
  address: string,
  conditions: string[],
  allergies: string[]
): Patient {
  return {
    patientId: uuidv4(),
    name,
    address,
    conditions,
    allergies,
  };
}
