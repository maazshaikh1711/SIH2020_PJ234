module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'prettier/prettier': 0,
    "unused-imports/no-unused-imports": 2,
    "react-native/no-inline-styles": 0,
    "eqeqeq": 2,
    "handle-callback-err": 0,
    "no-alert": 0,
    "consistent-this": 0,
    "no-shadow": 0,
    "import/no-unresolved": [2, { "commonjs": true, "amd": true }],
  },
  "plugins": [
    "import",
    "unused-imports",
  ],
};
