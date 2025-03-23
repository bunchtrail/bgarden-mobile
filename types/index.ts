// Роли пользователей
export enum UserRole {
  /**
   * Администратор системы (полный доступ)
   */
  Administrator = 1,
  
  /**
   * Работник ботанического сада (расширенный доступ)
   */
  Employee = 2,
  
  /**
   * Клиент (ограниченный доступ, только для просмотра)
   */
  Client = 3
}

// Типы секторов
export enum SectorType {
  Dendrology = 0,
  Flora = 1,
  Flowering = 2
}

// Тип экспоната (растения)
export interface Specimen {
  id: number;
  inventoryNumber: string;
  sectorType: number;
  latitude: number;
  longitude: number;
  locationWkt?: string;
  regionId?: number | null;
  regionName?: string | null;
  familyId: number;
  familyName: string;
  russianName: string;
  latinName: string;
  genus: string;
  species: string;
  cultivar?: string | null;
  form?: string | null;
  synonyms?: string | null;
  determinedBy?: string | null;
  plantingYear: number;
  sampleOrigin?: string | null;
  naturalRange?: string | null;
  ecologyAndBiology?: string | null;
  economicUse?: string | null;
  conservationStatus?: string | null;
  expositionId: number;
  expositionName: string;
  hasHerbarium: boolean;
  duplicatesInfo?: string | null;
  originalBreeder?: string | null;
  originalYear?: number | null;
  country?: string | null;
  illustration?: string | null;
  notes?: string | null;
  filledBy?: string | null;
  description?: string;
  category?: string;
  name?: string;
  scientificName?: string;
}

// Параметры фильтрации растений
export interface SpecimenFilterParams {
  searchField?: keyof Specimen;
  searchValue?: string;
  familyId?: number;
  sectorType?: SectorType;
  regionId?: number;
  expositionId?: number;
}

// Семейства растений
export interface Family {
  id: number;
  name: string;
  description?: string;
  specimensCount?: number;
}

// Регионы произрастания
export interface Region {
  id: number;
  name: string;
  description?: string;
  climate?: string;
  specimensCount?: number;
}

// Экспозиции (участки ботанического сада)
export interface Exposition {
  id: number;
  name: string;
  description?: string;
  specimensCount?: number;
} 