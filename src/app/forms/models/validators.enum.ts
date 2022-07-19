export enum Validators {
  Required = 'required',
  Pattern = 'pattern',
  CustomPattern = 'customPattern',
  Numeric = 'numeric',
  MaxLength = 'maxLength',
  MinLength = 'minLength',
  HideIfEmpty = 'hideIfEmpty',
  HideIfNotEqual = 'hideIfNotEqual',
  HideIfParentSiblingNotEqual = 'hideIfParentSiblingNotEqual',
  HideIfParentSiblingEqual = 'hideIfParentSiblingEqual',
  RequiredIfEquals = 'requiredIfEquals',
  RequiredIfNotEquals = 'requiredIfNotEquals'
}
