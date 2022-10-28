import { ValidatorNames } from '@forms/models/validators.enum';
import { AsyncValidatorNames } from '@forms/models/async-validators.enum';

const DEFAULT_LABEL = 'This field';
export const ErrorMessageMap: Record<string, (...args: any) => string> = {
  invalidOption: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is invalid`,
  invalidTestResult: (err: { message: string }) => err.message,
  [ValidatorNames.CustomPattern]: (err: { message: string }, label?: string) => `${label || DEFAULT_LABEL} ${err.message}`,
  [ValidatorNames.MaxLength]: (err: { requiredLength: number }, label?: string) =>
    `${label || DEFAULT_LABEL} must be less than or equal to ${err.requiredLength} characters`,
  [ValidatorNames.MinLength]: (err: { requiredLength: number }, label?: string) =>
    `${label || DEFAULT_LABEL} must be greater than or equal to ${err.requiredLength} characters`,
  [ValidatorNames.Pattern]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} must match a pattern`,
  [ValidatorNames.Required]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is required`,
  [ValidatorNames.RequiredIfEquals]: (err: { sibling: string }, label?: string) => `${label || DEFAULT_LABEL} is required with ${err.sibling}`,
  [ValidatorNames.Defined]: (err: boolean, label?: string) => `${label} is required`,
  [ValidatorNames.ValidateDefectNotes]: () => 'Notes is required',
  [ValidatorNames.Max]: (err: { max: number }, label?: string) => `${label || DEFAULT_LABEL} must be less than or equal to ${err.max}`,
  [ValidatorNames.Min]: (err: { min: number }, label?: string) => `${label || DEFAULT_LABEL} must be greater than or equal to ${err.min}`,
  [ValidatorNames.PastDate]: (err: boolean, label?: string) => `${label || 'This date'} must be in the past`,
  [ValidatorNames.FutureDate]: (err: boolean, label?: string) => `${label || 'This date'} must be in the future`,
  [ValidatorNames.AheadOfDate]: (err: { sibling: string }, label?: string) =>
    `${label || 'This date'} must be ahead of ${err.sibling || 'the previous date'}`,
  [AsyncValidatorNames.RequiredIfNotFail]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is required`,
  [AsyncValidatorNames.RequiredIfNotAbandoned]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is required`,
  [AsyncValidatorNames.RequiredIfNotResult]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is required`,
  [AsyncValidatorNames.RequiredIfNotResultAndSiblingEquals]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is required`,
  // Date errors
  invalidDate: (err: { error: boolean; reason: string; index: number }) => `${err.reason}`
};
