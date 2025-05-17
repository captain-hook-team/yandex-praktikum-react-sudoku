module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  plugins: ['@typescript-eslint'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  globals: {
    RequestInit: true,
  },
  rules: {
    'no-nested-ternary': 'off',
    '@typescript-eslint/ban-ts-comment': 1,
    '@typescript-eslint/no-unused-vars': ['off'],
    'class-methods-use-this': 'off',
    '@typescript-eslint/class-methods-use-this': ['off'],
    quotes: ['error', 'single'],
    'no-unused-vars': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/button-has-type': [0, {
      button: true,
      submit: true,
      reset: true,
    }],
    'import/extensions': [
      0,
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-underscore-dangle': [0, { allow: ['_place'] }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: true },
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline', // Запятая для массивов
        objects: 'always-multiline', // Запятая для объектов
        imports: 'always-multiline', // Запятая для импортов
        exports: 'always-multiline', // Запятая для экспорта
        functions: 'never', // Никогда не требовать запятую для функций
      },
    ],
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'object-curly-newline': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/label-has-for': 'off',
    'react/require-default-props': 'off',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state'], // Разрешает мутации `state` в редьюсерах
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      env: {
        jest: true,
      },
    },
  ],
};
