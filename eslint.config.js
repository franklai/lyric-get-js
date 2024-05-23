'use strict';
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const eslintPluginUnicorn = require('eslint-plugin-unicorn');
const jsdoc = require('eslint-plugin-jsdoc');

module.exports = [
  // eslintConfigAirbnbBase,
  eslintPluginUnicorn.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  jsdoc.configs['flat/recommended'],
  {
    rules: {
      'class-methods-use-this': 'off',
      camelcase: 'off',
      'jsdoc/require-jsdoc': 'off',
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
