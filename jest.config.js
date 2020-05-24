module.exports = {
  "verbose": true,
  "transform": {
    "^.+\\.js$": "babel-jest"
  },
  "testEnvironment": "jest-environment-jsdom-fourteen",
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
  },
  "moduleFileExtensions": [
    "js"
  ],
  "moduleDirectories": [
    "node_modules"
  ],
  "setupFiles": ["jest-canvas-mock"]
};