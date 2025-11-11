import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import { dirname } from 'path'
import tseslint from 'typescript-eslint'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const compat = new FlatCompat({ baseDirectory: __dirname })

const config = [
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'next-env.d.ts',
    ],
  },
  // ✅ 전역 React hook 규칙 끄기 (새 React 19 린트 대응)
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: globals.browser,
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'warn',
      'import/no-duplicates': 'error',
      'unused-imports/no-unused-imports': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  // 테스트 파일용 규칙 별도 객체 추가
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      'react/display-name': 'off',
      '@next/next/no-img-element': 'off',
      //React hooks 관련 린트 비활성화
      'react-hooks/set-state-in-effect': 'off',
    },
  },

  prettier,
]
export default config
