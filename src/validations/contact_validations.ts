import { checkSchema, ValidationChain } from 'express-validator';

const contactSchema: ValidationChain[] = checkSchema({
  name: {
    notEmpty: true,
    errorMessage: 'El nombre del contacto no debe quedar vacío.',
  },
});

export default contactSchema;
