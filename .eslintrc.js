// https://eslint.org/docs/user-guide/configuring

module.exports = {
  env: {
    node: true,
    es6: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/base',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  plugins: [
    'vue',
    'html'
  ],
  rules: {
    semi: [
      'error',
      'always'
    ],
    quotes: [
      'error',
      'single'
    ],
    indent: [
      'error',
      2
    ],
    "no-extend-native": 0,
    "no-multiple-empty-lines": [
      'error',
      {
        max: 1,
        maxEOF: 1
      }
    ],
    "no-dupe-keys": [
      'error'
    ],
    'no-unreachable': 'error',
    'no-multi-spaces': [
      'error'
    ],
    'comma-dangle': ['error', 'never'],
    'no-console': 0,
    'no-unused-vars': 1
    // 'array-element-newline': [
    //   'error',
    //   { multiline: false }
    // ]
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017
  },
  globals: {
    __routes: false,
    PATH_ROUTES: false
  }
}
