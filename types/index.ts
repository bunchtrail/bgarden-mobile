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
export enum LocationType {
  None = 0,
  Geographic = 1,
  SchematicMap = 2
}

// Параметры фильтрации для интерфейса
export interface FilterParams {
  searchQuery: string;
  familyFilter: string[];
  sectorFilter: string[];
  statusFilter: string[];
}

export interface Specimen {
  id: number;
  inventoryNumber: string;
  sectorType: SectorType;
  latitude?: number;
  longitude?: number;
  regionId?: number;
  region?: {
    id: number;
    name: string;
  };
  familyId: number;
  family?: {
    id: number;
    name: string;
  };
  russianName?: string;
  latinName?: string;
  genus?: string;
  species?: string;
  cultivar?: string;
  form?: string;
  synonyms?: string;
  determinedBy?: string;
  plantingYear?: number;
  sampleOrigin?: string;
  naturalRange?: string;
  ecologyAndBiology?: string;
  economicUse?: string;
  conservationStatus?: string;
  expositionId?: number;
  exposition?: {
    id: number;
    name: string;
  };
  hasHerbarium: boolean;
  duplicatesInfo?: string;
  originalBreeder?: string;
  originalYear?: number;
  country?: string;
  illustration?: string;
  notes?: string;
  filledBy?: string;
  createdAt: string;
  lastUpdatedAt?: string;
  mapId?: number;
  mapX?: number;
  mapY?: number;
  locationType: LocationType;
  images?: SpecimenImage[];
  mainImage?: string;
}

export interface SpecimenImage {
  id: number;
  specimenId: number;
  imageUrl: string; // URL для доступа к изображению
  imageDataBase64?: string; // Данные изображения в формате Base64
  contentType: string;
  description?: string;
  isMain: boolean;
  uploadedAt: string;
  thumbnailUrl?: string; // URL для миниатюрной версии
}

export interface SpecimenCreateDto {
  inventoryNumber: string;
  sectorType: SectorType;
  russianName?: string;
  latinName?: string;
  familyId: number;
  genus?: string;
  species?: string;
  expositionId?: number;
  plantingYear?: number;
  // Другие необходимые поля
}

export interface SpecimenUpdateDto {
  inventoryNumber?: string;
  sectorType?: SectorType;
  russianName?: string;
  latinName?: string;
  familyId?: number;
  genus?: string;
  species?: string;
  // Другие поля, которые можно обновить
}

export interface SpecimenSearchParams {
  query?: string;
  familyId?: number;
  sectorType?: SectorType;
  regionId?: number;
  expositionId?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginatedSpecimensResponse {
  items: Specimen[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SpecimenCoordinatesDto {
  // Географические координаты
  latitude?: number;
  longitude?: number;
  // Координаты на схематической карте
  mapId?: number;
  mapX?: number;
  mapY?: number;
  // Тип координат
  locationType: LocationType;
}

export interface SpecimenImageUploadResponse {
  success: boolean;
  imageId?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  error?: string;
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

// Типы для работы с растениями
export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  category: string;
  imageUrl?: string;
  location?: string; 
  careInstructions?: string;
  dateAdded: string;
}

export interface PlantCreateDto {
  name: string;
  scientificName: string;
  description: string;
  category: string;
  imageUrl?: string;
  location?: string;
  careInstructions?: string;
}

// Типы для результатов массовой загрузки изображений
export interface BatchSpecimenImageResult {
  specimenId: number;
  successCount: number;
  errorCount: number;
  uploadedImageIds: number[];
  errorMessages: string[];
}

// Интерфейс для отслеживания прогресса загрузки
export interface ProgressEvent {
  loaded: number;
  total: number;
} 