import simpleImportSort from 'eslint-plugin-simple-import-sort'
import createNeostandard, { resolveIgnoresFromGitignore } from 'neostandard'

const neostandard = createNeostandard({
  ignores: resolveIgnoresFromGitignore(),
})

export default [
  ...neostandard,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
]
