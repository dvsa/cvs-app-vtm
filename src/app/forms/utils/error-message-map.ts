export const ErrorMessageMap: { [key: string]: any } = {
  ['required']: (err: boolean, label: string) => `${label ? label : 'This filed'} is required`,
  ['pattern']: (err: boolean, label: string) => `${label ? label : 'This filed'} must match a pattern`,
  ['customPattern']: (err: { message: string }, label: string) => `${label ? label : 'This field'} ${err.message}`,
  invalidDate: (err: boolean, label: string) => `${label ? label : 'This filed'} is an invalid date`
};
