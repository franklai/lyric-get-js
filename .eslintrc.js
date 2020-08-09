module.exports = {
  extends: 'airbnb-base',
  rules: {
    'class-methods-use-this': 'off',
    camelcase: 'off',
    'no-console': 'off',
    'no-throw-literal': 'off',
    'comma-dangle': ['error', 'only-multiline'],
    'operator-linebreak': ['error', 'after'],
  },
  env: {
    browser: true,
  },
  settings: {
    'import/core-modules': ['electron'],
  },
};
