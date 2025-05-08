import { execa } from 'execa'
import splitLines from 'split-lines'

const run = async (binary, args, stream = false) => {
  const { stdout } = await execa(binary, args, {
    stdio: ['inherit', stream ? 'inherit' : 'pipe', 'inherit'],
  })
  return stream ? null : splitLines(stdout.toString())
}

export const runInstall = (useMise) => {
  const binary = useMise ? 'mise' : 'asdf'
  return async () => await run(binary, ['install'], true)
}

export const runList = (useMise) => {
  const [binary, args] = useMise
    ? ['mise', ['ls-remote']]
    : ['asdf', ['list', 'all']]
  return async (packageName) => await run(binary, [...args, packageName])
}
