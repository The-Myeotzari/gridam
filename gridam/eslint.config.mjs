import js from '@eslint/js'
import next from 'eslint-config-next'
import prettier from 'eslint-config-prettier/flat'
import globals from 'globals'

import importPlugin from 'eslint-plugin-import'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...next,

  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      '.vite/**',
      '.turbo/**',
      'coverage/**',
      'next-env.d.ts',
    ],
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
      'unused-imports': unusedImports,
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser },
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'warn',
      'object-shorthand': ['warn', 'always'],
      'prefer-template': 'warn',
      eqeqeq: ['error', 'smart'],
      curly: ['error', 'all'],
      'no-debugger': 'error',
      'no-console': ['off', { allow: ['warn', 'error'] }],

      'import/no-duplicates': 'error',
      'import/newline-after-import': ['warn', { count: 1 }],
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
        },
      ],

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['off', { args: 'after-used', ignoreRestSiblings: true }],

      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-key': ['error', { checkFragmentShorthand: true, checkKeyMustBeforeSpread: true }],
      'react/self-closing-comp': ['warn', { component: true, html: true }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    files: [
      'eslint.config.*',
      'prettier.config.*',
      'next.config.*',
      'vite.config.*',
      'scripts/**/*.{js,jsx,ts,tsx}',
    ],
    languageOptions: {
      sourceType: 'module',
      globals: globals.node,
    },
  },

  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },

  prettier,
]
