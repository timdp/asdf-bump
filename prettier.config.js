import neostandard from 'prettier-config-neostandard'

export default {
  ...neostandard,
  plugins: [...(neostandard.plugins ?? []), 'prettier-plugin-packagejson'],
}
