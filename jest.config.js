// jest.config.js
module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    globalSetup: 'jest-preset-angular/global-setup',
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
    testPathIgnorePatterns: ["/node_modules/", "/archive/"],
    globals: {
        crypto: require("crypto")
    },
    moduleNameMapper: {
        "^@models/(.*)": ["<rootDir>/src/app/models/$1"],
        "^@services/(.*)": ["<rootDir>/src/app/services/$1"],
        "^@store/(.*)": ["<rootDir>/src/app/store/$1"]
    }
};
