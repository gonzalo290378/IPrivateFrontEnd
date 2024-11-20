// filter-dto.model.ts

import { CityDTO } from "./city-dto";
import { CountryDTO } from "./country-dto";
import { FreeAreaDTO } from "./free-area-dto";
import { PreferenceDTO } from "./preference-dto";
import { PrivateAreaDTO } from "./private-area-dto";


export class FilterDTO {
  id?: number;
  username?: string;
  age?: number;
  sex?: string;
  email?: string;
  birthdate!: string; // LocalDate mapeado como string en formato ISO 8601
  registerDate!: string; // LocalDate mapeado como string en formato ISO 8601
  description?: string;
  isEnabled?: boolean;
  idFreeArea?: number;
  idPrivateArea?: number;
  freeAreaDTO?: FreeAreaDTO;
  privateAreaDTO?: PrivateAreaDTO;
  preferenceDTO?: PreferenceDTO;
  countryDTO?: CountryDTO;
  cityDTO?: CityDTO;
}
