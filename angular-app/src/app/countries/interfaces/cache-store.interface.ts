import { Country } from './country';


export interface CacheStore {
  byCountries: TermCountries;
}

export interface TermCountries {
  term: string;
  countries: Country[];
}


