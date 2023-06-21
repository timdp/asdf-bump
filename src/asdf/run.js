import { execa } from 'execa'
import splitLines from 'split-lines'

export const runAsdf = async (args) => {
  const { stdout } = await execa('asdf', args, {
    stdio: ['inherit', 'pipe', 'inherit']
  })
  return splitLines(stdout.toString())
}
