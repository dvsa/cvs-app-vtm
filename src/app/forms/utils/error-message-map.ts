const DEFAULT_LABEL = 'This field';
export const ErrorMessageMap: { [key: string]: any } = {
  ['required']: (err: boolean, label: string) => `${label || DEFAULT_LABEL} is required`,
  ['pattern']: (err: boolean, label: string) => `${label || DEFAULT_LABEL} must match a pattern`,
  ['customPattern']: (err: { message: string }, label: string) => `${label || DEFAULT_LABEL} ${err.message}`,
  invalidDate: (err: boolean, label: string) => `${label || DEFAULT_LABEL} is an invalid date`,
  maxlength: (err: { actualLength: number; requiredLength: number }, label: string) =>
    `${label || DEFAULT_LABEL} must be less than ${err.requiredLength} characters but you have entered ${err.actualLength} characters`
};
