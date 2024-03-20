import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, ValidationArguments } from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'isValidObjectId', async: false })
export class IsValidObjectIdConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return Types.ObjectId.isValid(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid ObjectId`;
  }
}

export function IsValidObjectId(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidObjectIdConstraint,
    });
  };
}