import { execa } from 'execa'
import splitLines from 'split-lines'

export const runAsdf = async (args, stream = false) => {
  const { stdout } = await execa('asdf', args, {
    stdio: ['inherit', stream ? 'inherit' : 'pipe', 'inherit']
  })
  return stream ? null : splitLines(stdout.toString())
}
