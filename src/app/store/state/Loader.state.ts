export interface ILoaderState {
  loading: boolean;
  status?: 'success' | 'error';
  error?: string;
}

export const initialLoaderState: ILoaderState = {
  loading: false,
  status: null,
  error: null,
};
