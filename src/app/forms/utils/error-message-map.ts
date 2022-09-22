import { ValidatorNames } from '@forms/models/validators.enum';

const DEFAULT_LABEL = 'This field';
export const ErrorMessageMap: Record<string, (...args: any) => string> = {
  invalidOption: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is invalid`,
  invalidTestResult: (err: { message: string }) => err.message,
  [ValidatorNames.CustomPattern]: (err: { message: string }, label?: string) => `${label || DEFAULT_LABEL} ${err.message}`,
  [ValidatorNames.MaxLength]: (err: { requiredLength: number }, label?: string) =>
    `${label || DEFAULT_LABEL} must be less than ${err.requiredLength} characters`,
  [ValidatorNames.MinLength]: (err: { requiredLength: number }, label?: string) =>
    `${label || DEFAULT_LABEL} must be greater than ${err.requiredLength} characters`,
  [ValidatorNames.Pattern]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} must match a pattern`,
  [ValidatorNames.Required]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is required`,
  [ValidatorNames.RequiredIfEquals]: (err: { sibling: string }, label?: string) => `${label || DEFAULT_LABEL} is required with ${err.sibling}`,
  [ValidatorNames.ValidateDefectNotes]: () => 'Notes is required',
  [ValidatorNames.Max]: (err: { max: number }, label?: string) => `${label || DEFAULT_LABEL} must be less than ${err.max}`,
  [ValidatorNames.Min]: (err: { min: number }, label?: string) => `${label || DEFAULT_LABEL} must be more than ${err.min}`,
  [ValidatorNames.PastDate]: (err: boolean, label?: string) => `${label || 'This date'} must be in the past`,
  // Date errors
  invalidDate: (err: { error: boolean; reason: string; index: number }) => `${err.reason}`
};

function displayArray(array: string[]) {
  const message = array.join(', ');
  const last = message.lastIndexOf(',');
  if (last !== -1) {
    return message.substring(0, last) + ' or ' + message.substring(last + 1, message.length);
  }
  return array[0];
}
