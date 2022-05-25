export const ErrorMessageMap: { [key: string]: any } = {
  required: (err: boolean, label: string) => `${label ? label : 'This filed'} is required`,
  invalidDate: (err: boolean, label: string) => `${label ? label : 'This filed'} is an invalid date`
};
