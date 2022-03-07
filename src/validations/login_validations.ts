import { checkSchema, ValidationChain } from 'express-validator';

const loginSchema: ValidationChain[] = checkSchema({
  email: {
    notEmpty: true,
    errorMessage: 'El email no debe quedar vacío.',
    isEmail: {
      bail: true,
      errorMessage: 'El email debe de tener un formato correcto.',
    },
  },
  password: {
    notEmpty: true,
    errorMessage: 'La contraseña no debe quedar vacía. ',
  },
});

export default loginSchema;
