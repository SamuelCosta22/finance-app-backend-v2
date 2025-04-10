import validator from 'validator';

export const checkIfIdIsValid = (id: string) => validator.isUUID(id);

export const checkIfIsString = (value: any) => typeof value === 'string';

export const validateRequiredFields = (params: any, requiredFields: any) => {
  for (const field of requiredFields) {
    const fieldIsMissing = !params[field];
    const fieldIsEmpty =
      checkIfIsString(params[field]) &&
      validator.isEmpty(params[field], {
        ignore_whitespace: true,
      });

    if (fieldIsMissing || fieldIsEmpty) {
      return { missingField: field, success: false };
    }
  }

  return { success: true, missingField: undefined };
};
