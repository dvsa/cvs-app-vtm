import { formatDate } from '@angular/common';
import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { ValidatorNames } from '@forms/models/validators.enum';

const DEFAULT_LABEL = 'This field';
export const ErrorMessageMap: Record<string, (...args: any) => string> = {
  // Date errors
  invalidDate: (err: { error: boolean; reason: string; index: number }) => `${err.reason}`,
  invalidOption: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is invalid`,
  invalidTestResult: (err: { message: string }) => err.message,

  [ValidatorNames.AheadOfDate]: (err: { sibling: string; date: Date }, label?: string) =>
    `${label || 'This date'} must be ahead of ${err.sibling || 'the previous date'}${err.date ? formatDate(err.date, ' (dd/MM/yyyy)', 'en') : ''}`,
  [ValidatorNames.CustomPattern]: (err: { message: string }, label?: string) => `${label || DEFAULT_LABEL} ${err.message}`,
  [ValidatorNames.DateNotExceed]: (err: { sibling: string; months: number }, label?: string) =>
    `${label || 'This date'} must be less than ${err.months || 'X'} months after ${err.sibling || 'the previous date'}`,
  [ValidatorNames.Defined]: (err: boolean, label?: string) => `${label} is required`,
  [ValidatorNames.FutureDate]: (err: boolean, label?: string) => `${label || 'This date'} must be in the future`,
  [ValidatorNames.Max]: (err: { max: number }, label?: string) => `${label || DEFAULT_LABEL} must be less than or equal to ${err.max}`,
  [ValidatorNames.MaxLength]: (err: { requiredLength: number }, label?: string) =>
    `${label || DEFAULT_LABEL} must be less than or equal to ${err.requiredLength} characters`,
  [ValidatorNames.Min]: (err: { min: number }, label?: string) => `${label || DEFAULT_LABEL} must be greater than or equal to ${err.min}`,
  [ValidatorNames.MinLength]: (err: { requiredLength: number }, label?: string) =>
    `${label || DEFAULT_LABEL} must be greater than or equal to ${err.requiredLength} characters`,
  [ValidatorNames.NotZNumber]: () => "The VRM/Trailer ID cannot be in a format that is 7 digits followed by the character 'Z'",
  [ValidatorNames.PastDate]: (err: boolean, label?: string) => `${label || 'This date'} must be in the past`,
  [ValidatorNames.Pattern]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} must match a pattern`,
  [ValidatorNames.Required]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is required`,
  [ValidatorNames.RequiredIfEquals]: (err: { sibling: string }, label?: string) => `${label || DEFAULT_LABEL} is required with ${err.sibling}`,
  [ValidatorNames.ValidateDefectNotes]: () => 'Notes is required',
  [ValidatorNames.ValidateProhibitionIssued]: () => 'Prohibition notice has not been issued.',

  [AsyncValidatorNames.RequiredIfNotAbandoned]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is required`,
  [AsyncValidatorNames.RequiredIfNotFail]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is required`,
  [AsyncValidatorNames.RequiredIfNotResult]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is required`,
  [AsyncValidatorNames.RequiredIfNotResultAndSiblingEquals]: (err: boolean, label?: string) => `${label || DEFAULT_LABEL} is required`
};
