import type { Location } from '../location/location.type';

export interface Dropdown {
  kategoriAset: string[];
  kondisiAset: string[];
  statusAset: string[];
  lokasi: Location[];
}
