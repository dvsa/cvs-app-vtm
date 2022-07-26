import { ValidatorNames } from '@forms/models/validators.enum';

const DEFAULT_LABEL = 'This field';
export const ErrorMessageMap: Record<string, (...args: any) => string> = {
  [ValidatorNames.Required]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is required`,
  [ValidatorNames.Pattern]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} must match a pattern`,
  [ValidatorNames.CustomPattern]: (err: { message: string }, label?: string) => `${label || DEFAULT_LABEL} ${err.message}`,
  invalidDate: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is an invalid date`,
  [ValidatorNames.MaxLength]: (err: { requiredLength: number }, label?: string) =>
    `${label || DEFAULT_LABEL} must be less than ${err.requiredLength} characters`,
  [ValidatorNames.MinLength]: (err: { requiredLength: number }, label?: string) =>
    `${label || DEFAULT_LABEL} must be greater than ${err.requiredLength} characters`,
  invalidOption: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is invalid`,
  [ValidatorNames.RequiredIfEquals]: (err: { sibling: string }, label?: string) => `${label || DEFAULT_LABEL} is required with ${err.sibling}`,
  [ValidatorNames.validateDefectNotes]: () => 'Notes is required'
};

function displayArray(array: string[]) {
  const message = array.join(', ');
  const last = message.lastIndexOf(',');
  if (last !== -1) {
    return message.substring(0, last) + ' or ' + message.substring(last + 1, message.length);
  }
  return array[0];
}
