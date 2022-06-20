export const ErrorMessageMap: { [key: string]: any } = {
  ['required']: (err: boolean, label: string) => `${label ?? 'This field'} is required`,
  ['pattern']: (err: boolean, label: string) => `${label ?? 'This field'} must match a pattern`,
  ['customPattern']: (err: { message: string }, label: string) => `${label ?? 'This field'} ${err.message}`,
  invalidDate: (err: boolean, label: string) => `${label ?? 'This field'} is an invalid date`,
  maxlength: (err: { requiredLength: number }, label: string) => `${label ?? 'This field'} must be less than ${err.requiredLength} characters`,
  minlength: (err: { requiredLength: number }, label: string) => `${label ?? 'This field'} must be greater than ${err.requiredLength} characters`
};
