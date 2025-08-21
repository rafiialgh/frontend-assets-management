import type { UserRole } from '../auth/auth.type';
import type { Location, SubCategory } from '../location/location.type';



export interface Dropdown {
  subKategoriAset: SubCategory[];
  kategoriAset: string[];
  kondisiAset: string[];
  statusAset: string[];
  lokasi: Location[];
  hakMilik: string[];
  userRole: UserRole[];
}
