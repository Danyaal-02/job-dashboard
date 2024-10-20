import Joi from 'joi';

export const validationSchemas = {
  registration: Joi.object({
    name: Joi.string().required(),
    companyName: Joi.string().required(),
    companyEmail: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    mobile: Joi.string().pattern(/^\+?[0-9]{10,15}$/).required(),
    employeeSize: Joi.number().integer().min(1).required(),
  }),

  login: Joi.object({
    companyEmail: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  emailVerification: Joi.object({
    companyEmail: Joi.string().email().required(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
  }),

  mobileVerification: Joi.object({
    mobile: Joi.string().pattern(/^\+?[0-9]{10,15}$/).required(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
  }),

  resendOTP: Joi.object({
    companyEmail: Joi.string().email().required(),
    type: Joi.string().valid('email', 'mobile').required(),
  }),

  jobCreation: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    experienceLevel: Joi.string().required(),
    candidates: Joi.array().items(Joi.string().email()),
    endDate: Joi.date().greater('now').required(),
  }),
};

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
