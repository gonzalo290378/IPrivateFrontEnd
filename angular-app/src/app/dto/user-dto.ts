import { CityDTO } from './city-dto';
import { CountryDTO } from './country-dto';
import { FreeAreaDTO } from './free-area-dto';
import { PreferenceDTO } from './preference-dto';
import { PrivateAreaDTO } from './private-area-dto';

export class UserDTO {
  id?: number;
  username!: string;
  age!: number;
  sex!: string;
  email!: string;
  birthdate!: string;
  registerDate?: string;
  description!: string;
  isEnabled?: boolean;
  password!: string;
  idFreeArea?: number;
  idPrivateArea?: number;
  freeAreaDTO?: FreeAreaDTO;
  privateAreaDTO?: PrivateAreaDTO;
  preferenceDTO?: PreferenceDTO;
  countryDTO?: CountryDTO;
  cityDTO?: CityDTO;
  alt_img?: string;
}
