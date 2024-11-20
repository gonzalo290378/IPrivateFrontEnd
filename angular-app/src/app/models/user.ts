import { City } from './city';
import { Country } from './country';
import { Preference } from './preference';

export interface User {
  id?: number;
  username: string;
  age: number;
  sex: string;
  email: string;
  birthdate: string;
  registerDate?: string;
  description: string;
  isEnabled: boolean;
  password: string;
  idFreeArea?: number;
  idPrivateArea?: number;
  preference?: Preference;
  country?: Country;
  city?: City;
}
