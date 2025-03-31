import { useCallback } from 'react';

interface ValidationForm {
  isSimpleMode?: boolean;
  inventoryNumber?: string;
  russianName: string;
  latinName: string;
  familyId?: string;
  description?: string;
  category?: string;
  setErrors: (errors: Record<string, string>) => void;
}

export const useSpecimenFormValidation = (form: ValidationForm) => {
  const {
    russianName,
    description,
    category,
    setErrors
  } = form;
  
  const validateForm = useCallback(() => {
    const formErrors: Record<string, string> = {};
    let isValid = true;

    // Проверки для простого режима
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

    setErrors(formErrors);
    return isValid;
  }, [russianName, description, category, setErrors]);

  return { validateForm };
};
