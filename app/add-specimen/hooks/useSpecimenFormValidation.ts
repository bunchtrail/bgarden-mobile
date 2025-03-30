import { useCallback } from 'react';

interface ValidationForm {
  isSimpleMode: boolean;
  inventoryNumber?: string;
  russianName: string;
  latinName: string;
  familyId?: string;
  description?: string;
  category?: string;
  setErrors: (errors: Record<string, string>) => void;
}

// Обновление хука для получения полного объекта формы
export const useSpecimenFormValidation = (form: ValidationForm) => {
  const {
    isSimpleMode,
    inventoryNumber,
    russianName,
    latinName,
    familyId,
    description,
    category,
    setErrors
  } = form;
  
  const validateForm = useCallback(() => {
    const formErrors: Record<string, string> = {};
    let isValid = true;

    // Проверки для простого режима
    if (isSimpleMode) {
      if (!russianName) {
        formErrors.russianName = 'Необходимо указать русское название';
        isValid = false;
      }

      if (!description) {
        formErrors.description = 'Необходимо ввести описание';
        isValid = false;
      }

      if (!category) {
        formErrors.category = 'Необходимо выбрать категорию';
        isValid = false;
      }
    } 
    // Проверки для полного режима
    else {
      if (!inventoryNumber) {
        formErrors.inventoryNumber = 'Необходимо указать инвентарный номер';
        isValid = false;
      }

      if (!latinName) {
        formErrors.latinName = 'Необходимо указать латинское название';
        isValid = false;
      }

      if (!familyId) {
        formErrors.familyId = 'Необходимо выбрать семейство';
        isValid = false;
      }
    }

    setErrors(formErrors);
    return isValid;
  }, [isSimpleMode, inventoryNumber, russianName, latinName, familyId, description, category, setErrors]);

  return { validateForm };
};
