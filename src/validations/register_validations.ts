import { checkSchema, ValidationChain } from 'express-validator';

const registerSchema: ValidationChain[] = checkSchema({
  name: {
    notEmpty: true,
    errorMessage: 'El nombre de usuario no debe quedar vacío.',
  },
  email: {
    notEmpty: true,
    errorMessage: 'El email no debe quedar vacío.',
    isEmail: {
      bail: true,
      errorMessage: 'El email debe de tener un formato válido.',
    },
  },
  password: {
    notEmpty: true,
    errorMessage: 'La contraseña no debe quedar vacía.',
    isLength: {
      bail: true,
      options: {
        min: 8,
      },
      errorMessage: 'La contraseña debe de contener 8 caracteres como mínimo.',
    },
  },
  confirm_password: {
    notEmpty: true,
    errorMessage: 'Debe confirmar la contraseña.',
    custom: {
      bail: true,
      options: (value, { req }) => {
        return value === req.body.password ? true : false;
      },
      errorMessage: 'Las contraseñas deben coincidir.',
    },
  },
});

export default registerSchema;
