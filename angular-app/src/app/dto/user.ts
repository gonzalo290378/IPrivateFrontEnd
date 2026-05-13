import { CityDTO } from "../dto/city-dto";
import { CountryDTO } from "../dto/country-dto";
import { PreferenceDTO } from "../dto/preference-dto";

export interface User {
  id?: number;
  username: string;
  age: number;
  sex: string;
  birthdate: string;
  registerDate?: string;
  description: string;
  isEnabled: boolean;
  idFreeArea?: number;
  preference?: PreferenceDTO;
  country?: CountryDTO;
  city?: CityDTO;
}
