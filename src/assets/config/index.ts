import {merge} from 'lodash';


const baseConfig = {
  'appInsights': {
    'instrumentationKey': '#{appInsightsKey}'
  },
  'logging': {
    'console': true,
    'appInsights': true
  },
  'aad': {
    'requireAuth': true
  },
  'adalConfig': {
    'cacheLocation': 'localStorage',
    'endpoints': {
      'api': 'xxx-bae6-4760-b434-xxx'
    }
  }
};

export const createConfig = (config) => merge({}, baseConfig, config);
