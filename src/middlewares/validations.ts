import { Request, Response, NextFunction } from 'express';
import Joi, { ValidationResult } from 'joi';

const createPatientSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  conditions: Joi.array().items(Joi.string()).required(),
  allergies: Joi.array().items(Joi.string()).required(),
});


const updatePatientSchema = Joi.object({
  name: Joi.string().optional(),
  address: Joi.string().optional(),
  conditions: Joi.array().items(Joi.string()).optional(),
  allergies: Joi.array().items(Joi.string()).optional(),
}).min(1); 

const queryByConditionSchema = Joi.object({
  condition: Joi.string().optional(),
  address: Joi.string().optional(),
});
const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error }: ValidationResult = schema.validate(req.body || req.query);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return 
    }
    next();
  };
};

export const validateCreatePatient = validate(createPatientSchema);
export const validateUpdatePatient = validate(updatePatientSchema);
export const validateQueryByCondition = validate(queryByConditionSchema);
