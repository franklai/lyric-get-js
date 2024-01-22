'use strict';
// const eslintConfigAirbnbBase = require('eslint-config-airbnb-base');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const eslintPluginUnicorn = require('eslint-plugin-unicorn');

module.exports = [
  // eslintConfigAirbnbBase,
  eslintPluginUnicorn.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  {
    rules: {
      'class-methods-use-this': 'off',
      camelcase: 'off',
      'no-console': 'off',
      'no-restricted-syntax': [
        'error',
        'ForInStatement',
        'LabeledStatement',
        'WithStatement',
      ],
      'prettier/prettier': 'error',
      'unicorn/expiring-todo-comments': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-node-protocol': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          checkFilenames: false,
        },
      ],
    },
  },
];
