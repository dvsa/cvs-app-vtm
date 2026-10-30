import { environment as deployedEnvironment } from './environment.deploy';

export const environment = {
	...deployedEnvironment,
	production: false,
	VTM_REDIRECT_URI: 'http://localhost:4200/',
};
