module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    'airbnb',
    'airbnb-typescript',
    // 'airbnb-base'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    "newline-after-var": "warn",
    "newline-before-return": "warn",
    "class-methods-use-this": "off",
    "no-empty-function": "off",
    "computed-property-spacing": "error",
    "key-spacing": "error",
    "object-curly-spacing": "error",
    "no-implicit-coercion": 2,
    "no-underscore-dangle": "off",
    "@typescript-eslint/type-annotation-spacing": [
      "error",
      {
        "before": true,
        "after": true
      }
    ],
    '@typescript-eslint/type-annotation-spacing': 'off',
    '@typescript-eslint/indent': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
