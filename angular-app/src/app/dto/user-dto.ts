import { CityDTO } from './city-dto';
import { CountryDTO } from './country-dto';
import { FreeAreaDTO } from './free-area-dto';
import { PreferenceDTO } from './preference-dto';
import { PrivateAreaDTO } from './private-area-dto';
import { StateDTO } from './state-dto';

export class UserDTO {
  id?: number;
  username!: string;
  age!: number;
  sex!: string;
  birthdate!: string;
  registerDate?: string;
  description!: string;
  isEnabled?: boolean;
  idFreeArea?: number;
  idPrivateArea?: number;
  freeAreaDTO?: FreeAreaDTO;
  preferenceDTO?: PreferenceDTO;
  countryDTO?: CountryDTO;
  cityDTO?: CityDTO;
  stateDTO?: StateDTO;
  alt_img?: string;
}
