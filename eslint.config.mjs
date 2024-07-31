import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default antfu({
  formatters: true,
  react: true,
  ...compat.config({
    extends: ['next/core-web-vitals'],
  }),
  rules: {
    'no-console': 1,
    'unused-imports/no-unused-vars': 1,
    'node/prefer-global/process': 0,
    'ts/no-require-imports': 0,
  },
})
