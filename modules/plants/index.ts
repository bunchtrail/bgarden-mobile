import { plantsApi, specimenImagesApi } from './services';
import { CreateSpecimenImageDto, UpdateSpecimenImageDto } from './services';

export * from './context/PlantsContext';
export * from './screens';
export * from './hooks';

// В будущем здесь будет экспорт других компонентов и функций модуля 

export { plantsApi, specimenImagesApi };
export type { CreateSpecimenImageDto, UpdateSpecimenImageDto }; 