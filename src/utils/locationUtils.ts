import { Country, State, City, ICountry, ICity } from 'country-state-city';

export interface LocationOption {
  value: string;
  label: string;
  code?: string;
}

export interface ContinentData {
  [continent: string]: {
    countries: ICountry[];
  };
}

// Continent mapping based on UN geoscheme
export const CONTINENT_MAPPING: { [key: string]: string[] } = {
  'Asia': ['AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'CY', 'GE', 'IN', 'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA', 'LB', 'MY', 'MV', 'MN', 'MM', 'NP', 'KP', 'OM', 'PK', 'PS', 'PH', 'QA', 'SA', 'SG', 'KR', 'LK', 'SY', 'TW', 'TJ', 'TH', 'TL', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE'],
  'Europe': ['AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'XK', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA'],
  'Americas': ['AG', 'AR', 'BS', 'BB', 'BZ', 'BO', 'BR', 'CA', 'CL', 'CO', 'CR', 'CU', 'DM', 'DO', 'EC', 'SV', 'GD', 'GT', 'GY', 'HT', 'HN', 'JM', 'MX', 'NI', 'PA', 'PY', 'PE', 'KN', 'LC', 'VC', 'SR', 'TT', 'US', 'UY', 'VE'],
  'Africa': ['DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'DJ', 'EG', 'GQ', 'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'CI', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'SZ', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW'],
  'Oceania': ['AU', 'FJ', 'KI', 'MH', 'FM', 'NR', 'NZ', 'PW', 'PG', 'WS', 'SB', 'TO', 'TV', 'VU']
};

/**
 * Get all continents
 */
export const getContinents = (): LocationOption[] => {
  return Object.keys(CONTINENT_MAPPING).map(continent => ({
    value: continent,
    label: continent
  }));
};

/**
 * Get countries by continent
 */
export const getCountriesByContinent = (continent: string): LocationOption[] => {
  const countryCodes = CONTINENT_MAPPING[continent] || [];
  const allCountries = Country.getAllCountries();
  
  return allCountries
    .filter(country => countryCodes.includes(country.isoCode))
    .map(country => ({
      value: country.name,
      label: country.name,
      code: country.isoCode
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Get all countries grouped by continent
 */
export const getAllCountriesByContinent = (): ContinentData => {
  const result: ContinentData = {};
  
  Object.keys(CONTINENT_MAPPING).forEach(continent => {
    const countryCodes = CONTINENT_MAPPING[continent];
    const allCountries = Country.getAllCountries();
    
    result[continent] = {
      countries: allCountries
        .filter(country => countryCodes.includes(country.isoCode))
        .sort((a, b) => a.name.localeCompare(b.name))
    };
  });
  
  return result;
};

/**
 * Get states/provinces by country
 */
export const getStatesByCountry = (countryCode: string): LocationOption[] => {
  const states = State.getStatesOfCountry(countryCode);
  
  return states.map(state => ({
    value: state.name,
    label: state.name,
    code: state.isoCode
  })).sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Get cities by country
 */
export const getCitiesByCountry = (countryCode: string): LocationOption[] => {
  const cities = City.getCitiesOfCountry(countryCode);

  if (!cities) return [];

  return cities.map(city => ({
    value: city.name,
    label: city.name
  })).sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Get cities by state
 */
export const getCitiesByState = (countryCode: string, stateCode: string): LocationOption[] => {
  const cities = City.getCitiesOfState(countryCode, stateCode);
  
  return cities.map(city => ({
    value: city.name,
    label: city.name
  })).sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Get country code by name
 */
export const getCountryCodeByName = (countryName: string): string | undefined => {
  const allCountries = Country.getAllCountries();
  const country = allCountries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
  return country?.isoCode;
};

/**
 * Get continent by country name
 */
export const getContinentByCountry = (countryName: string): string | undefined => {
  const countryCode = getCountryCodeByName(countryName);
  if (!countryCode) return undefined;
  
  for (const [continent, countryCodes] of Object.entries(CONTINENT_MAPPING)) {
    if (countryCodes.includes(countryCode)) {
      return continent;
    }
  }
  
  return undefined;
};

/**
 * Search countries by name (for autocomplete)
 */
export const searchCountries = (query: string): LocationOption[] => {
  const allCountries = Country.getAllCountries();
  const searchTerm = query.toLowerCase();
  
  return allCountries
    .filter(country => 
      country.name.toLowerCase().includes(searchTerm) ||
      country.isoCode.toLowerCase().includes(searchTerm)
    )
    .map(country => ({
      value: country.name,
      label: country.name,
      code: country.isoCode
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(0, 50); // Limit results
};

/**
 * Search cities by name and country (for autocomplete)
 */
export const searchCities = (query: string, countryCode?: string): LocationOption[] => {
  const searchTerm = query.toLowerCase();
  let cities: ICity[] = [];

  if (countryCode) {
    const citiesForCountry = City.getCitiesOfCountry(countryCode);
    cities = citiesForCountry || [];
  } else {
    // This would be expensive for all cities, so we'll limit it
    const majorCountries = ['US', 'GB', 'FR', 'DE', 'IT', 'ES', 'JP', 'AU', 'CA', 'IN'];
    cities = majorCountries.flatMap(code => City.getCitiesOfCountry(code) || []);
  }

  return cities
    .filter(city => city.name.toLowerCase().includes(searchTerm))
    .map(city => ({
      value: city.name,
      label: city.name
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(0, 50); // Limit results
};
