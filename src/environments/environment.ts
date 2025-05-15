// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	TARGET_ENV: 'dev',
	RemoveAADFullAccessRole: true,
	EnableDevTools: true,
	VTM_CLIENT_ID: '',
	VTM_AUTHORITY_ID: '',
	VTM_REDIRECT_URI: '/',
	VTM_API_URI: '',
	VTM_API_CLIENT_ID: '',
	LOGS_API_KEY: '',
	DOCUMENT_RETRIEVAL_API_KEY: '',
	FEEDBACK_URI: '',
	SENTRY_DSN: '',
	VTM_GTM_CONTAINER_ID: '',
	VTM_GTM_MEASUREMENT_ID: '',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
