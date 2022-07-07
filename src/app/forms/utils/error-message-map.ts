export const ErrorMessageMap: { [key: string]: any } = {
  ['required']: (err: boolean, label: string) => `${label || 'This filed'} is required`
};
