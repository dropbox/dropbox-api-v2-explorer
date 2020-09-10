module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
      node: false,
      es6: true,
    },
    rules: {
      'quotes': [2, 'single'],
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended'
    ]
  };